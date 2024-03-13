package com.app.compliance.controller;

import com.app.compliance.dto.*;
import com.app.compliance.model.Component;
import com.app.compliance.repository.DocumentRepository;
import com.app.compliance.repository.UserRepository;
import com.app.compliance.services.EmailSenderService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import com.app.compliance.entities.User;
import com.app.compliance.services.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;

import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/app/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    

    private final AuthenticationService authenticationService;
    private final PasswordEncoder passwordEncoder;

    @Value("${urlbase}")
    private String urlbase;

    @Autowired
    private EmailSenderService senderService;

    @Autowired
    private final UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<User> signup(@RequestBody SignUpRequest signUpRequest) throws MessagingException {
        return ResponseEntity.ok(authenticationService.signup(signUpRequest));
    }


    @PostMapping("/signin")
    public ResponseEntity<JwtAuthenticationResponse> signin(@RequestBody SigninRequest signinRequest, HttpServletResponse response) {
        JwtAuthenticationResponse jwtAuthenticationResponse = authenticationService.signin(signinRequest, response);

        return ResponseEntity.ok(jwtAuthenticationResponse);
    }


    @PostMapping("/refresh")
    public ResponseEntity<JwtAuthenticationResponse> refresh(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        return ResponseEntity.ok(authenticationService.refreshToken(refreshTokenRequest));
    }

    @GetMapping("/logout")
    public ResponseEntity<String> clearCookies(
            @CookieValue(name = "jwt", defaultValue = "") String exampleCookie) {

        return ResponseEntity.ok()
                .header("Set-Cookie", "jwt=; Max-Age=0;  Path=/app")
                .header("Set-Cookie", "refresh=; Max-Age=0;  Path=/app")
                .body("JWT cookies cleared");
    }

    @PostMapping("/validate")
    public ResponseEntity<String> validate() {
        return ResponseEntity.ok("Permission accepted");
    }


    @GetMapping("/verify")
    public ResponseEntity<String> VerifyUser(@RequestParam("user") String userid,
                                             @RequestParam("c") String code
    ) {

        Optional<User> optuser = userRepository.findById(Integer.parseInt(userid));
        

        //VERIFY THAT THE USER EXISTS AND THE ACTIVATION CODE MATCHES THE ONE IN THE DATABASE
        if (optuser.isPresent()) {
            User user = optuser.get();
            if (code.equals(user.getActivationcode().toUpperCase()) && !user.isEnabled()) {
                user.setActiveuser(true);
                user.setActivationcode(null);
                userRepository.save(user);
                String loginurl = urlbase +"/app/";
                return ResponseEntity.ok("<h1>Congratulations!</h1> <p>Your user has been successfully verified.</p><p> You can <a href='"+loginurl+"'>login now</a>.<p>");
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error in your activation tentative");
    }

    @GetMapping("/sendverification")
    public ResponseEntity<String> SendVerification(@RequestParam("user") String username) {

        Optional<User> optuser = userRepository.findByEmail(username);
        //VERIFY THAT THE USER EXIST
        if (optuser.isPresent()) {
            User user = optuser.get();
            String activationcode = generateRandomString(16);
            user.setActivationcode(activationcode);
            userRepository.save(user);
            String body = "<h1>MedDataHub Account verification service</h1><h3>Password change request</h3><p> If you have requested to change the password, please use the following security code: " + activationcode + "</p>";
            //SEND A MAIL WITH THE ACTIVATION CODE
            try {
                senderService.sendEmail(user.getEmail(), "Med Data Hub - Change Password", body);
            } catch (Exception e) {
                System.out.println("Error sending email: " + e);
            }


            return ResponseEntity.ok("Security code has been sent");

        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error in your activation tentative");
    }

    @PostMapping("/changepassword")
    public ResponseEntity<String> signup(@RequestBody ChangePasswordRequest cpRequest) {
        Optional<User> optuser = userRepository.findByEmail(cpRequest.getId());
        if (optuser.isPresent()) {
            User user = optuser.get();
            String activationcode = user.getActivationcode();
            if (!activationcode.equals(cpRequest.getSecurity()) || !cpRequest.getPassword().equals(cpRequest.getRepeat()) || user.getActivationcode().isEmpty())
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Credentials incorrect");

            user.setPassword(passwordEncoder.encode(cpRequest.getPassword()));
            user.setActivationcode(null);
            userRepository.save(user);
            return ResponseEntity.ok("Password changed successfully");
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: User Not found");

    }

    @PostMapping("/changepasswordlogged")
    public ResponseEntity<String> signup(@RequestBody ChangePasswordLoggedRequest cpRequest) {
        Optional<User> optuser = userRepository.findByEmail(cpRequest.getId());
        if (optuser.isPresent()) {
            User user = optuser.get();
            if (!passwordEncoder.matches(cpRequest.getCurrent(), user.getPassword()) || !cpRequest.getPassword().equals(cpRequest.getRepeat()))
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credentials incorrect");
            user.setPassword(passwordEncoder.encode(cpRequest.getPassword()));
            userRepository.save(user);
            return ResponseEntity.ok("Password changed successfully");
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: User Not found");

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


}
