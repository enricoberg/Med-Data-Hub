package com.app.compliance.services;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LogService {
    
    @Autowired
    private JWTService jwtService;

    private static final String FILE_PATH = "C:/Program Files/MedDataHub/log.txt";

    public boolean writeToLog(String text, String fulltoken) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(FILE_PATH, true))) {
            String token=fulltoken.substring(7);
            String email = jwtService.extractUserName(token);
            LocalDateTime now = LocalDateTime.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            String formattedDatetime = now.format(formatter);
            String full_log=formattedDatetime + " - user: " + email + " - action: " + text;
            writer.write(full_log + "\n"); 
            return true; 
        } catch (IOException e) {
            e.printStackTrace();
            return false; 
        }
    }
    
}
