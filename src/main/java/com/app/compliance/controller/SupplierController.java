package com.app.compliance.controller;


import com.app.compliance.model.Component;
import com.app.compliance.model.Supplier;
import com.app.compliance.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/querysup")
@RequiredArgsConstructor
public class SupplierController {

    @Autowired
    private final SupplierRepository supplierRepository;

    @GetMapping("/")
    public List<Supplier> getAllSuppliersFiltered(
            @RequestParam(required = false) String sapcode,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String contact
    ) {




        List<Supplier> allsups = supplierRepository.findAll();
        List<Supplier> toRemove=new ArrayList<>();

        for (Supplier s : allsups) {
            if (name!=null && !s.getSupplier_name().toUpperCase().contains(name.toUpperCase())) toRemove.add(s);
            else if (sapcode!=null && !s.getSap_code().toUpperCase().contains(sapcode.toUpperCase())) toRemove.add(s);
            else if (contact!=null && !s.getContact().toUpperCase().contains(contact.toUpperCase())) toRemove.add(s);

        }

        allsups.removeAll(toRemove);
        return allsups;

    }

    @PostMapping("/new")
    public ResponseEntity<String> createNewSupplier(
            @RequestParam("name") String name,
            @RequestParam("sap") String sap,
            @RequestParam("contact") String contact) {







        try {
            // Create the new Supplier object
            Supplier supplier = new Supplier();
            supplier.setSupplier_name(name);
            supplier.setSap_code(sap);
            supplier.setContact(contact);
            //Save the newly created supplier
            supplierRepository.save(supplier);
        }
        catch (Exception e) { return ResponseEntity.status(500).body("Failed to add the new supplier"); }
        return ResponseEntity.ok("New supplier created successfully!");
    }

    @GetMapping("/byid")
    public Optional<Supplier> RetrieveComponent(@RequestParam("id") Integer id) {
        return supplierRepository.findById(id);
    }


}
