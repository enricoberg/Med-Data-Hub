package com.app.compliance.services;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.compliance.model.LogInfo;
import com.app.compliance.repository.LogRepository;
import com.app.compliance.repository.UserRepository;

@Service
public class LogService {
    
    @Autowired
    private JWTService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LogRepository logRepository;

    private static final String FILE_PATH = System.getProperty("user.dir") + File.separator + "log.txt";

    // public boolean writeToLog(String text, String fulltoken) {
    //     try (BufferedWriter writer = new BufferedWriter(new FileWriter(FILE_PATH, true))) {
    //         String token=fulltoken.substring(7);
    //         String email = jwtService.extractUserName(token);
    //         LocalDateTime now = LocalDateTime.now();
    //         DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    //         String formattedDatetime = now.format(formatter);
    //         String full_log=formattedDatetime + " - user: " + email + " - action: " + text;
    //         writer.write(full_log + "\n"); 
    //         return true; 
    //     } catch (IOException e) {
    //         e.printStackTrace();
    //         return false; 
    //     }
    // }

    public boolean writeToLog(String text, String fulltoken) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(FILE_PATH, true))) {
            String token=fulltoken.substring(7);
            String email = jwtService.extractUserName(token);          
            String role = userRepository.findByEmail(email).get().getRole().toString();
            LogInfo loginfo = new LogInfo();
            loginfo.setTime(LocalDateTime.now());
            loginfo.setUsername(email);
            loginfo.setRole(role);
            loginfo.setAction(text);
            logRepository.save(loginfo);            
            return true; 
        } catch (IOException e) {
            e.printStackTrace();
            return false; 
        }
    }
    
}
