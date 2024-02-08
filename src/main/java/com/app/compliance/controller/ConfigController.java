package com.app.compliance.controller;

import com.app.compliance.dto.BomRequest;
import com.app.compliance.dto.ConfRequest;
import com.app.compliance.model.*;
import com.app.compliance.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/queryconfigs")
@RequiredArgsConstructor
public class ConfigController {

    @Autowired
    private final ConfigurationRepository configRepository;

    @Autowired
    private final MaterialRepository materialRepository;

    @Autowired
    private final ComponentRepository componentRepository;

    @Autowired
    private final SupplierRepository supplierRepository;



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

    @PostMapping("/new")
    public ResponseEntity<String> createNewBomItem(@RequestBody ConfRequest[] bomObjects) {
        try{
            for (ConfRequest obj : bomObjects){

                Optional<Configuration> opt_config = configRepository.findBySuppliercompnumber(obj.getSupcompcode());
                if(!opt_config.isPresent()) {

                    Configuration newconfig = new Configuration();
                    newconfig.setComponent(componentRepository.findById(obj.getCompid()).get());
                    newconfig.setSupplier(supplierRepository.findById(obj.getSupid()).get());
                    newconfig.setSuppliercompnumber(obj.getSupcompcode());
                    configRepository.save(newconfig);
                    configRepository.insertMaterialConfiguration(newconfig.getId(), obj.getMatid());
                }
                else{
                    Configuration existingconfig=configRepository.findBySuppliercompnumber(obj.getSupcompcode()).get();
                    configRepository.insertMaterialConfiguration(existingconfig.getId(), obj.getMatid());
                }
            }
        }
        catch (Exception e) { return ResponseEntity.status(500).body("Failed to save the bom"); }
        return ResponseEntity.ok("New set of configs created successfully!");
    }

}
