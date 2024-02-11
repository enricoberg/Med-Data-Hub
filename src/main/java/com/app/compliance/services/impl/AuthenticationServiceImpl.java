package com.app.compliance.services.impl;

import com.app.compliance.repository.UserRepository;
import com.app.compliance.dto.JwtAuthenticationResponse;
import com.app.compliance.dto.RefreshTokenRequest;
import com.app.compliance.dto.SignUpRequest;
import com.app.compliance.dto.SigninRequest;
import com.app.compliance.entities.Role;
import com.app.compliance.entities.User;
import com.app.compliance.services.AuthenticationService;
import com.app.compliance.services.EmailSenderService;
import com.app.compliance.services.JWTService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Random;

import org.springframework.http.HttpHeaders;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {



   private final UserRepository userRepository;

   private final PasswordEncoder passwordEncoder;

   private final AuthenticationManager authenticationManager;

   private final JWTService jwtService;


   @Autowired
   private EmailSenderService senderService;

    @Value("${urlbase}")
    private String urlbase;


   public User signup(SignUpRequest signUpRequest) throws MessagingException {
       User user = new User();

       user.setEmail(signUpRequest.getEmail());
       user.setFirstname(signUpRequest.getFirstName());
       user.setSecondname(signUpRequest.getLastName());
       user.setRole(Role.USER);
       user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
       String randomstring=generateRandomString(16);

       user.setActivationcode(randomstring);
       user.setActiveuser(false);
       userRepository.save(user);
       String validationlink=urlbase+"/app/auth/verify?user="+user.getId()+"&c="+randomstring;
       String body="<h1>MedDataHub Account verification service</h1><h3>Welcome "+capitalize(user.getFirstname())+" "+capitalize(user.getSecondname())+"!</h3><p> To activate your account, please <a href=\""+validationlink+"\">CLICK HERE</a></p>";
        //SEND A MAIL WITH THE ACTIVATION CODE
       try {
           senderService.sendEmail(user.getEmail(), "Med Data Hub - User Activation", body);
       }catch(Exception e){
           System.out.println("Error sending email: "+e);
       }
      return userRepository.save(user);
   }



    public JwtAuthenticationResponse signin(SigninRequest signinRequest, HttpServletResponse response) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(signinRequest.getEmail(),
                signinRequest.getPassword()));

        var user = userRepository.findByEmail(signinRequest.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        var jwt = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(new HashMap<>(), user);

        JwtAuthenticationResponse jwtAuthenticationResponse = new JwtAuthenticationResponse();
        jwtAuthenticationResponse.setToken(jwt);
        jwtAuthenticationResponse.setRefreshToken(refreshToken);

        // Set the JWT token in the response header
        response.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + jwt);

        return jwtAuthenticationResponse;
        
    }




   public JwtAuthenticationResponse refreshToken(RefreshTokenRequest refreshTokenRequest){
       String userEmail = jwtService.extractUserName(refreshTokenRequest.getToken());
       User user = userRepository.findByEmail(userEmail).orElseThrow();
       if(jwtService.isTokenValid(refreshTokenRequest.getToken(), user)){
           var jwt = jwtService.generateToken(user);

           JwtAuthenticationResponse jwtAuthenticationResponse = new JwtAuthenticationResponse();

           jwtAuthenticationResponse.setToken(jwt);
           jwtAuthenticationResponse.setRefreshToken(refreshTokenRequest.getToken());
           return jwtAuthenticationResponse;
       }
       return null;
   }


    public static String generateRandomString(int length) {
        String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int index = random.nextInt(CHARACTERS.length());
            sb.append(CHARACTERS.charAt(index));
        }
        return sb.toString();
    }

    public static String capitalize(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }
        return Character.toUpperCase(str.charAt(0)) + str.substring(1);
    }
}
