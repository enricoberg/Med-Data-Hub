package com.app.compliance;
import com.app.compliance.entities.Role;
import com.app.compliance.entities.User;
import com.app.compliance.repository.UserRepository;

import java.io.File;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

// @PropertySource(value = {"file:///C:/Program Files/MedDataHub/application.properties"})

@SpringBootApplication
public class App implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;

    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }

    public void run(String... args){
        User adminAccount = userRepository.findByRole(Role.ADMIN);
        if(null == adminAccount){
            User user = new User();

            user.setEmail("admin@gmail.com");
            user.setFirstname("admin");
            user.setSecondname("admin");
            user.setRole(Role.ADMIN);
            user.setPassword(new BCryptPasswordEncoder().encode("admin"));
            user.setActiveuser(true);
            userRepository.save(user);
        }


        System.out.println("SERVER RUNNING.....");
        
 
    }

 
}
