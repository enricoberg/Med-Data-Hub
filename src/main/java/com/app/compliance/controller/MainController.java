package com.app.compliance.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpServletRequest;

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

    

    
}