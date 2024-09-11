package com.app.compliance.controller;

import com.app.compliance.dto.BomRequest;
import com.app.compliance.dto.BomUpdate;
import com.app.compliance.dto.ConfRequest;
import com.app.compliance.dto.ConfUpdate;
import com.app.compliance.dto.ConfigView;
import com.app.compliance.model.*;
import com.app.compliance.repository.*;
import com.app.compliance.services.LogService;

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

    @Autowired
    private LogService logService;


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
            List<MaterialConfiguration> allmatconfigs = materialConfigurationRepository.findByConfid(c.getId());
            
            for (MaterialConfiguration mconf : allmatconfigs){              
                    Material mat = materialRepository.findById(mconf.getMaterialid()).get();
                    allviews.add(new ConfigView(c.getId(),c.getSupplier().getSupplier_name(), c.getSuppliercompnumber(),mat.getBrandname(), mat.getFamily().name(), mat.getSupplier() ));
            }



        }

        return allviews;
    }

    @PostMapping("/new")
    public ResponseEntity<String> createNewBomItem(@RequestBody ConfRequest[] bomObjects,@RequestHeader(name = "Authorization") String token) {
        try {
            for (ConfRequest obj : bomObjects) {
                //SEE IF THERE IS ALREADY A CONFIGURATION WITH SAID SUPPLIER'S COMPONENT NUMBER AND ACT ACCORDINGLY
                
                Supplier supplier = supplierRepository.findById(obj.getSupid()).get();               
                
                Optional<Configuration> opt_config = configRepository.findBySuppliercompnumberAndSupplier(obj.getSupcompcode(),supplier);
                
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
                    Configuration existingconfig = configRepository.findBySuppliercompnumberAndSupplier(obj.getSupcompcode(),supplier).get();                    
                    configRepository.insertMaterialConfiguration(existingconfig.getId(), obj.getMatid());
                }
                logService.writeToLog("Added new configuration for component ID "+obj.getCompid()+", Supplier ID: "+obj.getSupid()+", Supplier component number: "+obj.getSupcompcode()+", Material ID: "+obj.getMatid()+"",token);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to save the bom");
        }
        return ResponseEntity.ok("New set of configs created successfully!");
    }


    @GetMapping("/deleteconfig")
    public ResponseEntity<String> deleteConfItem(        
        @RequestParam(required = true) Integer confid,
        @RequestParam(required = true) Integer matid,
        @RequestHeader(name = "Authorization") String token
    ) {
        
        try{
            if(!materialConfigurationRepository.existsByConfidAndMaterialid(confid, matid)) throw new Exception();    
            List<MaterialConfiguration> confs = materialConfigurationRepository.findByMaterialidAndConfid(matid, confid);    
            for(MaterialConfiguration conf : confs){
                materialConfigurationRepository.delete(conf);
            }               
            List<MaterialConfiguration> allconfigs = materialConfigurationRepository.findByConfid(confid);
            if(allconfigs.isEmpty()) {
                Configuration config_to_delete = configRepository.findById(confid).get();
                configRepository.delete(config_to_delete);
            }
            
            logService.writeToLog("Deleted configuration with material ID "+matid+" and configuration ID "+confid,token);
            
        }catch(Exception e ){
            return ResponseEntity.status(500).body("Failed to delete the component: "+e);
        }
        return ResponseEntity.ok("Component deleted successfully");
    }





}
