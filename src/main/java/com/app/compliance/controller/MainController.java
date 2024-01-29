package com.app.compliance.controller;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;



@Controller
@RequestMapping("/app")
public class MainController {

    @GetMapping("/")
    public String index() {
        return "login";
    }

    @GetMapping("/home")
    public String homepage() {
        return "home";
    }

    @GetMapping("/logout")
    public boolean deleteCookie(HttpServletResponse response) {

        return true;
    }

    
}