package com.app.compliance.controller;


import com.app.compliance.model.Supplier;
import com.app.compliance.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

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


}
