package com.app.compliance.config;

import com.app.compliance.services.UserService;
import com.app.compliance.entities.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    private final UserService userService;
    



    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{

        String[] WHITE_LIST_URL = {
                "/app/auth/**",
                "/app/",
                "/app/home/**",
                "/app/logout/**",
                "/css/**",
                "/js/**",
                "/queryconfigs/**"
        };


        http.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(request -> request.requestMatchers(WHITE_LIST_URL)
                        .permitAll()

                        .requestMatchers("/admin").hasAnyAuthority(Role.ADMIN.name())
                        .requestMatchers("/user").hasAnyAuthority(Role.USER.name())
                        .requestMatchers("/querydocs/**").hasAnyAuthority(Role.ADMIN.name())
                        .requestMatchers("/querydocs/**").hasAnyAuthority(Role.USER.name())
                        .requestMatchers("/querycomp/**").hasAnyAuthority(Role.ADMIN.name())
                        .requestMatchers("/querycomp/**").hasAnyAuthority(Role.USER.name())
                        .requestMatchers("/queryprod/**").hasAnyAuthority(Role.ADMIN.name())
                        .requestMatchers("/queryprod/**").hasAnyAuthority(Role.USER.name())
                        .requestMatchers("/querymat/**").hasAnyAuthority(Role.ADMIN.name())
                        .requestMatchers("/querymat/**").hasAnyAuthority(Role.USER.name())
                        .requestMatchers("/querysup/**").hasAnyAuthority(Role.ADMIN.name())
                        .requestMatchers("/querysup/**").hasAnyAuthority(Role.USER.name())
                        .requestMatchers("/queryboms/**").hasAnyAuthority(Role.ADMIN.name())
                        .requestMatchers("/queryboms/**").hasAnyAuthority(Role.USER.name())
                        .requestMatchers("/download/**").hasAnyAuthority(Role.ADMIN.name())
                        .requestMatchers("/download/**").hasAnyAuthority(Role.USER.name())
                        .requestMatchers("/aux/**").hasAnyAuthority(Role.ADMIN.name())
                        .requestMatchers("/aux/**").hasAnyAuthority(Role.USER.name())
                        .anyRequest().authenticated())


                .sessionManagement(manager -> manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider()).addFilterBefore(
                        jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class
                );
        return http.build();


    }








    @Bean
    public AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userService.userDetailsService());
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

  
}
