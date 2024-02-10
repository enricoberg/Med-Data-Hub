package com.app.compliance.services;

import com.app.compliance.entities.User;
import com.app.compliance.dto.JwtAuthenticationResponse;
import com.app.compliance.dto.RefreshTokenRequest;
import com.app.compliance.dto.SignUpRequest;
import com.app.compliance.dto.SigninRequest;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthenticationService {

    User signup(SignUpRequest signUpRequest) throws MessagingException;

    JwtAuthenticationResponse signin(SigninRequest signinRequest, HttpServletResponse response);

    JwtAuthenticationResponse refreshToken(RefreshTokenRequest refreshTokenRequest);
}
