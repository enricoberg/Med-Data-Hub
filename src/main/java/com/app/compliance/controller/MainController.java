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

    @GetMapping("/editproducts")
    public String editProducts() {
        return "edit_products";
    }

    @GetMapping("/editmaterials")
    public String editMaterials() {
        return "edit_materials";
    }

    @GetMapping("/editsuppliers")
    public String editSuppliers() {
        return "edit_suppliers";
    }

    @GetMapping("/editboms")
    public String editBoms() {
        return "edit_boms";
    }

    @GetMapping("/editconfigurations")
    public String editConfigs() {
        return "edit_configurations";
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