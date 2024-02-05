package com.app.compliance.controller;


import com.app.compliance.model.Component;
import com.app.compliance.model.Material;
import com.app.compliance.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
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

    @PostMapping("/new")
    public ResponseEntity<String> createNewMaterial(
            @RequestParam("name") String name,
            @RequestParam("supplier") String supplier,
            @RequestParam("plasticizer") String plasticizer,           
            @RequestPart("family") String fam) {



            // Create the new Material object
            Material material = new Material();
            Material.MaterialFamily family= Material.MaterialFamily.valueOf(fam);
            material.setBrandname(name);
            material.setSupplier(supplier);
            material.setPlasticizer(plasticizer);
            material.setFamily(family);
            


            //Save the Material to the database
            try {
                materialRepository.save(material);
            }
            catch (Exception e) { return ResponseEntity.status(500).body("Failed to save the material"); }
            return ResponseEntity.ok("New material created successfully!");
        }


}
