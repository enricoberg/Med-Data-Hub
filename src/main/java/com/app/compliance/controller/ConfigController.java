package com.app.compliance.controller;

import com.app.compliance.model.Component;
import com.app.compliance.model.Configuration;
import com.app.compliance.repository.ComponentRepository;
import com.app.compliance.repository.ConfigurationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/queryconfigs")
@RequiredArgsConstructor
public class ConfigController {

    @Autowired
    private final ConfigurationRepository configRepository;

    @GetMapping("/")
    public List<Configuration> getAllComponentsFiltered(
            @RequestParam(required = false) String article
    ) {

        List<Configuration> allconf= configRepository.findAll();
        List<Configuration> toRemove=new ArrayList<>();

        for (Configuration c : allconf) {
            if (article!=null && !c.getComponent().getComp_id().toUpperCase().equals(article.toUpperCase())) toRemove.add(c);

        }
        allconf.removeAll(toRemove);
        return allconf;
    }

    @GetMapping("/hello")
    @ResponseBody
    public String hello() {
        return "Hello, World!";
    }

}
