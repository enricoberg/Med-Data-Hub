package com.app.compliance.controller;

import com.app.compliance.dto.BomRequest;
import com.app.compliance.dto.ConfRequest;
import com.app.compliance.dto.ConfigView;
import com.app.compliance.model.*;
import com.app.compliance.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
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

    @Autowired
    private final MaterialConfigurationRepository materialConfigurationRepository;


    @GetMapping("/")
    public List<ConfigView> getAllComponentsFiltered(
            @RequestParam(required = false) String article
    ) {
        if(article.isEmpty()) return new ArrayList<>();
        Component reference_component= componentRepository.findByCompid(article);
        Integer comp_id=reference_component.getId();
        List<Configuration> allconf = configRepository.findByCompid(comp_id);
        List<ConfigView> allviews = new ArrayList<>();

        for (Configuration c : allconf) {
            List<MaterialConfiguration> toRemove = new ArrayList<>();
            List<MaterialConfiguration> allmatconfigs = materialConfigurationRepository.findAll();
            for (MaterialConfiguration mconf : allmatconfigs){

                if(mconf.getConfid()== c.getId()) {
                    Material mat = materialRepository.findById(mconf.getMaterialid()).get();
                    allviews.add(new ConfigView(c.getSupplier().getSupplier_name(), c.getSuppliercompnumber(),mat.getBrandname(), mat.getFamily().name(), mat.getSupplier() ));
                }

            }



        }

        return allviews;
    }

    @PostMapping("/new")
    public ResponseEntity<String> createNewBomItem(@RequestBody ConfRequest[] bomObjects) {
        try {
            for (ConfRequest obj : bomObjects) {
                //SEE IF THERE IS ALREADY A CONFIGURATION WITH SAID SUPPLIER'S COMPONENT NUMBER AND ACT ACCORDINGLY
                Optional<Configuration> opt_config = configRepository.findBySuppliercompnumber(obj.getSupcompcode());
                //CASE 1: THERE IS NO MATCHING SUPPLIER'S CODE
                if (!opt_config.isPresent()) {

                    Configuration newconfig = new Configuration();
                    newconfig.setCompid(obj.getCompid());
                    newconfig.setSupplier(supplierRepository.findById(obj.getSupid()).get());
                    newconfig.setSuppliercompnumber(obj.getSupcompcode());
                    configRepository.save(newconfig);
                    configRepository.insertMaterialConfiguration(newconfig.getId(), obj.getMatid());
                }
                //CASE 2: THE CODE ALREADY EXISTS
                else {
                    Configuration existingconfig = configRepository.findBySuppliercompnumber(obj.getSupcompcode()).get();
                    configRepository.insertMaterialConfiguration(existingconfig.getId(), obj.getMatid());
                }
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to save the bom");
        }
        return ResponseEntity.ok("New set of configs created successfully!");
    }

}
