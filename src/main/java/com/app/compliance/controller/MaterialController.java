package com.app.compliance.controller;


import com.app.compliance.model.Component;
import com.app.compliance.model.Material;
import com.app.compliance.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/querymat")
@RequiredArgsConstructor
public class MaterialController {

    @Autowired
    private final MaterialRepository materialRepository;

    @GetMapping("/")
    public List<Material> getAllMaterialsFiltered(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String family,
            @RequestParam(required = false) String plasticizer,
            @RequestParam(required = false) String supplier
    ) {




        List<Material> allmats = materialRepository.findAll();
        List<Material> toRemove=new ArrayList<>();

        for (Material m : allmats) {
            if (brand!=null && !m.getBrandname().toUpperCase().contains(brand.toUpperCase())) toRemove.add(m);
            else if (family!=null && !family.equals("all") && m.getFamily()!=null && !m.getFamily().name().equals(family)) toRemove.add(m);
            else if (plasticizer!=null && m.getPlasticizer()!=null  && !m.getPlasticizer().toUpperCase().contains(plasticizer.toUpperCase())) toRemove.add(m);
            else if(plasticizer!=null && !plasticizer.isEmpty() && m.getPlasticizer()==null) toRemove.add(m);
            else if (supplier!=null && !m.getSupplier().toUpperCase().contains(supplier.toUpperCase())) toRemove.add(m);

        }

        allmats.removeAll(toRemove);
        return allmats;

    }

}
