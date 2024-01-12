package com.app.compliance.services.impl;

import com.app.compliance.repository.UserRepository;
import com.app.compliance.dto.JwtAuthenticationResponse;
import com.app.compliance.dto.RefreshTokenRequest;
import com.app.compliance.dto.SignUpRequest;
import com.app.compliance.dto.SigninRequest;
import com.app.compliance.entities.Role;
import com.app.compliance.entities.User;
import com.app.compliance.services.AuthenticationService;
import com.app.compliance.services.JWTService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpServletResponse;
import java.util.HashMap;
import org.springframework.http.HttpHeaders;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

   private final UserRepository userRepository;

   private final PasswordEncoder passwordEncoder;

   private final AuthenticationManager authenticationManager;

private final JWTService jwtService;

   public User signup(SignUpRequest signUpRequest){
       User user = new User();

       user.setEmail(signUpRequest.getEmail());
       user.setFirstname(signUpRequest.getFirstName());
       user.setSecondname(signUpRequest.getLastName());
       user.setRole(Role.USER);
       user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));

      return userRepository.save(user);
   }

//   public JwtAuthenticationResponse signin(SigninRequest signinRequest){
//       authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(signinRequest.getEmail(),
//               signinRequest.getPassword()));
//
//       var user = userRepository.findByEmail(signinRequest.getEmail()).orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));
//       var jwt = jwtService.generateToken(user);
//       var refreshToken = jwtService.generateRefreshToken(new HashMap<>(), user);
//
//       JwtAuthenticationResponse jwtAuthenticationResponse = new JwtAuthenticationResponse();
//
//       jwtAuthenticationResponse.setToken(jwt);
//       jwtAuthenticationResponse.setRefreshToken(refreshToken);
//       return jwtAuthenticationResponse;
//   }

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

        // Set the refresh token in the response body or header if needed

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

}
