package com.app.compliance.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.app.compliance.model.Component;
import com.app.compliance.model.Configuration;
import com.app.compliance.model.Material;
import com.app.compliance.model.Supplier;
import com.app.compliance.repository.ComponentRepository;
import com.app.compliance.repository.ConfigurationRepository;
import com.app.compliance.repository.MaterialRepository;
import com.app.compliance.repository.SupplierRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/aux")
@RequiredArgsConstructor
public class AuxController {

    @Autowired
    private final SupplierRepository supplierRepository;

    @Autowired
    private final ComponentRepository componentRepository;

    @Autowired
    private final  MaterialRepository materialRepository;

    @GetMapping("/getsuppliers")
    public List<Supplier> getAllSuppliers() {        
        return  supplierRepository.findAll();
    }

    @GetMapping("/getcomponents")
    public List<Component> getAllComponents() {        
        return  componentRepository.findAll();
    }

    @GetMapping("/getmaterials")
    public List<Material> getAllMaterial() {        
        return  materialRepository.findAll();
    }

    


    
}
