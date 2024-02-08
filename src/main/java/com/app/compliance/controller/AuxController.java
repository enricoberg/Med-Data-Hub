package com.app.compliance.controller;


import java.util.List;


import com.app.compliance.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.compliance.model.Component;

import com.app.compliance.model.Material;
import com.app.compliance.model.Supplier;

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
