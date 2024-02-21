package com.app.compliance.controller;


import java.util.List;
import java.util.Optional;


import com.app.compliance.entities.User;
import com.app.compliance.model.Product;
import com.app.compliance.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
    private final ProductRepository productRepository;

    @Autowired
    private final SupplierRepository supplierRepository;

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final ComponentRepository componentRepository;

    @Autowired
    private final MaterialRepository materialRepository;

    @GetMapping("/getsuppliers")
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    @GetMapping("/getcomponents")
    public List<Component> getAllComponents() {
        return componentRepository.findAll();
    }

    @GetMapping("/getsemifinished")
    public List<Product> getAllProductsSemifinished() {
        return productRepository.findBySemifinished(true);
    }

    @GetMapping("/getmaterials")
    public List<Material> getAllMaterial() {
        return materialRepository.findAll();
    }

    @GetMapping("/getrole")
    public String getRole(@RequestParam("email") String email) {
        Optional<User> optuser = userRepository.findByEmail(email);
        if (!optuser.isPresent()) return null;
        User user = optuser.get();
        return user.getRole().toString();
    }


}
