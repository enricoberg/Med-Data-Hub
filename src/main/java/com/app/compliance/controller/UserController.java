package com.app.compliance.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.compliance.entities.User;
import com.app.compliance.model.Document;
import com.app.compliance.repository.UserRepository;
import com.app.compliance.services.LogService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    

    @Autowired
    private LogService logService;

    @GetMapping("/logaccess")
    public boolean logAccess(@RequestHeader(name = "Authorization") String token) {
        try{
            logService.writeToLog("User logged in.",token);
            return true;
        }
        catch(Exception e){
            return false;
        }
    }

}
