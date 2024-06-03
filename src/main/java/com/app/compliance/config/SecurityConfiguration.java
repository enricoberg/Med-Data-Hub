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
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        //SET A LIST OF URLS THAT CAN BE ACCESSED WITHOUT AUTHENTICATION
        String[] WHITE_LIST_URL = {
                "/app/auth/signup",
                "/app/passwordchange/**",
                "/app/passwordchangelogged/**",
                "/app/auth/signin",
                "/app/auth/signup",
                "/app/auth/refresh",
                "/app/auth/sendverification",
                "/app/auth/changepassword",
                "/app/auth/changepasswordlogged",
                "/app/auth/logout",
                "/app/auth/verify",
                "/app/",
                "/app/editcomponents",
                "/app/editproducts",
                "/app/home/**",
                "/app/logout/**",
                "/css/**",
                "/js/**",
                "/js/table_pages/**",
                "/js/insert_pages/**",
                "/js/edit_pages/**",
                "/js/custom_queries/**"
        };

        //SET URLS TO BE ACCESSIBLE ONLY AFTER AUTHENTICATION BY SPECIFIC ROLES
        http.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(request -> request.requestMatchers(WHITE_LIST_URL)
                        .permitAll()
                        .requestMatchers("/app/auth/validate").hasAnyAuthority("ADMIN", "USER", "SUPERUSER")
                        .requestMatchers("/admin").hasAnyAuthority("ADMIN")
                        .requestMatchers("/user").hasAnyAuthority("USER")
                        .requestMatchers("/querydocs").hasAnyAuthority("ADMIN", "USER", "SUPERUSER")
                        .requestMatchers("/querydocs/getnextrev").hasAnyAuthority("ADMIN", "SUPERUSER")
                        .requestMatchers("/querycomp").hasAnyAuthority("ADMIN", "USER", "SUPERUSER")
                        .requestMatchers("/queryprod").hasAnyAuthority("ADMIN", "USER", "SUPERUSER")
                        .requestMatchers("/querymat").hasAnyAuthority("ADMIN", "USER", "SUPERUSER")
                        .requestMatchers("/querysup").hasAnyAuthority("ADMIN", "USER", "SUPERUSER")
                        .requestMatchers("/queryboms").hasAnyAuthority("ADMIN", "USER", "SUPERUSER")
                        .requestMatchers("/queryboms/new").hasAnyAuthority("ADMIN", "SUPERUSER")
                        .requestMatchers("/querydocs/new").hasAnyAuthority("ADMIN", "SUPERUSER")
                        .requestMatchers("/querycomp/new").hasAnyAuthority("ADMIN", "SUPERUSER")
                        .requestMatchers("/queryprod/new").hasAnyAuthority("ADMIN", "SUPERUSER")
                        .requestMatchers("/querymat/new").hasAnyAuthority("ADMIN", "SUPERUSER")
                        .requestMatchers("/querysup/new").hasAnyAuthority("ADMIN", "SUPERUSER")
                        .requestMatchers("/download/**").hasAnyAuthority("ADMIN", "USER", "SUPERUSER")
                        .requestMatchers("/aux/**").hasAnyAuthority("ADMIN", "USER", "SUPERUSER")
                        .requestMatchers("/queryconfigs/**").hasAnyAuthority("ADMIN", "USER", "SUPERUSER")
                        .anyRequest().authenticated())
                .sessionManagement(manager -> manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider()).addFilterBefore(
                        jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class
                );
        return http.build();


    }


    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userService.userDetailsService());
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }


}
