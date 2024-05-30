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

    @GetMapping("/editcomponents")
    public String editComponents() {
        return "edit_components";
    }

    @GetMapping("/passwordchange")
    public String passwordchange() {
        return "pwc";
    }

    @GetMapping("/passwordchangelogged")
    public String passwordchangeLogged() {
        return "pwc_logged";
    }

    @GetMapping("/logout")
    public boolean deleteCookie(HttpServletResponse response) {

        return true;
    }

    
    
}