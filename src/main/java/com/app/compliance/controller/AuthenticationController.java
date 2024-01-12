package com.app.compliance.controller;
import jakarta.servlet.http.HttpServletResponse;
import com.app.compliance.dto.JwtAuthenticationResponse;
import com.app.compliance.dto.RefreshTokenRequest;
import com.app.compliance.dto.SignUpRequest;
import com.app.compliance.dto.SigninRequest;
import com.app.compliance.entities.User;
import com.app.compliance.services.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/app/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/signup")
    public ResponseEntity<User> signup(@RequestBody SignUpRequest signUpRequest){
        return ResponseEntity.ok(authenticationService.signup(signUpRequest));
    }

//    @PostMapping("/signin")
//    public ResponseEntity<JwtAuthenticationResponse> signin(@RequestBody SigninRequest signinRequest){
//        return ResponseEntity.ok(authenticationService.signin(signinRequest));
//    }

    @PostMapping("/signin")
    public ResponseEntity<JwtAuthenticationResponse> signin(@RequestBody SigninRequest signinRequest, HttpServletResponse response) {
        JwtAuthenticationResponse jwtAuthenticationResponse = authenticationService.signin(signinRequest, response);

        return ResponseEntity.ok(jwtAuthenticationResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<JwtAuthenticationResponse> refresh(@RequestBody RefreshTokenRequest refreshTokenRequest){
        return ResponseEntity.ok(authenticationService.refreshToken(refreshTokenRequest));
    }

    @GetMapping("/")
    public String home(){
        return "Welcome home";
    }
}
