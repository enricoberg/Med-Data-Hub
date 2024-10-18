package com.app.compliance.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDate;
import java.time.LocalDateTime;
import com.app.compliance.model.LogInfo;
import com.app.compliance.repository.LogRepository;
import com.app.compliance.services.JWTService;
import com.app.compliance.services.LogService;
import java.util.List;
import org.springframework.web.bind.annotation.RequestHeader;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    

    @Autowired
    private LogService logService;

    @Autowired
    private LogRepository logRepository;

    @Autowired
    private JWTService jwtService;

    @GetMapping("/logaccess")
    public boolean logAccess(@RequestHeader(name = "Authorization") String token) {
        
        String email = jwtService.extractUserName(token.substring(7));  
        List<LogInfo> logs = logRepository.findByUsername(email);
        boolean found = false;
        LocalDate now = LocalDate.now();
        for(LogInfo log : logs){
            LocalDateTime logtime = log.getTime();
            LocalDate variableLocalDate = logtime.toLocalDate();
            if (variableLocalDate.equals(now)) found = true;
        }
        if(found) return true;
        try{
            logService.writeToLog("User logged in.",token);
            return true;
        }
        catch(Exception e){
            return false;
        }
    }

}
