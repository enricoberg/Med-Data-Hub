package com.app.compliance.controller;


import com.app.compliance.dto.ComponentExplosion;
import com.app.compliance.model.Component;
import com.app.compliance.model.Material;
import com.app.compliance.model.MaterialConfiguration;
import com.app.compliance.model.Supplier;
import com.app.compliance.repository.BomRepository;
import com.app.compliance.repository.ComponentRepository;
import com.app.compliance.repository.ConfigurationRepository;
import com.app.compliance.repository.MaterialConfigurationRepository;
import com.app.compliance.repository.MaterialRepository;
import com.app.compliance.repository.ProductRepository;
import com.app.compliance.services.UsageController;

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
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/querymat")
@RequiredArgsConstructor
public class MaterialController {

    @Autowired
    private final BomRepository bomRepository;

    @Autowired
    private final ComponentRepository componentRepository;

    @Autowired
    private final MaterialRepository materialRepository;

    @Autowired
    private final ProductRepository productRepository;

    @Autowired
    private final MaterialConfigurationRepository matconfRepository;

    @Autowired
    private final ConfigurationRepository configurationRepository;

    @GetMapping("/")
    public List<Material> getAllMaterialsFiltered(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String family,
            @RequestParam(required = false) String plasticizer,
            @RequestParam(required = false) String supplier
    ) {


        List<Material> allmats = materialRepository.findAll();
        List<Material> toRemove = new ArrayList<>();
        //ELIMINATE ALL THE RECORDS THAT DO NOT MATCH WITH THE PARAMETERS REQUESTED
        for (Material m : allmats) {
            if (brand != null && !m.getBrandname().toUpperCase().contains(brand.toUpperCase())) toRemove.add(m);
            else if (family != null && !family.equals("all") && m.getFamily() != null && !m.getFamily().name().equals(family))
                toRemove.add(m);
            else if (plasticizer != null && m.getPlasticizer() != null && !m.getPlasticizer().toUpperCase().contains(plasticizer.toUpperCase()))
                toRemove.add(m);
            else if (plasticizer != null && !plasticizer.isEmpty() && m.getPlasticizer() == null) toRemove.add(m);
            else if (supplier != null && !m.getSupplier().toUpperCase().contains(supplier.toUpperCase()))
                toRemove.add(m);

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
        Material.MaterialFamily family = Material.MaterialFamily.valueOf(fam);
        material.setBrandname(name);
        material.setSupplier(supplier);
        material.setPlasticizer(plasticizer);
        material.setFamily(family);


        //Save the Material to the database
        try {
            materialRepository.save(material);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to save the material");
        }
        return ResponseEntity.ok("New material created successfully!");
    }

    @GetMapping("/byid")
    public Optional<Material> RetrieveComponent(@RequestParam("id") Integer id) {
        return materialRepository.findById(id);
    }

    @GetMapping("/inproduct")
    public String productsContainingMaterial(@RequestParam("id") Integer id) {

        //FIRST CREATE AN ARRAY WITH A LIST OF MATERIAL-CONFIGURATIONS MATCHING THE SPECIFIED MATERIAL
        List<MaterialConfiguration> allmatconf = matconfRepository.findByMaterialid(id);
        List<Integer> allconfids = new ArrayList<>();
        for(MaterialConfiguration mc : allmatconf){
            Integer conf_id = mc.getConfid();
            allconfids.add(conf_id);
        }
        // THEN EXTRACT AN ARRAY WITH A LIST OF COMPONENTS MATCHING THE PREVIOUSLY FOUND CONFIGURATIONS
        List<Integer> allcompids = new ArrayList<>();
        for(Integer i : allconfids){
            Integer comp_id = configurationRepository.findById(i).get().getCompid();
            allcompids.add(comp_id);            
        }
        //REMOVE DUPLICATES
        HashSet<Integer> set = new HashSet<>(allcompids);
        List<Integer> listWithoutDuplicates = new ArrayList<>(set);
        //LOOP THROUGH ALL THE COMPONENTS AND GET THEIR ARTICLE NUMBERS
        List<String> allarticles = new ArrayList<>();
        UsageController usageController = new UsageController(bomRepository, componentRepository, productRepository);
        for(Integer i : listWithoutDuplicates){
            String article = componentRepository.findById(i).get().getComp_id();
            allarticles.add(article);

        }
        
        List<ComponentExplosion> results =  new ArrayList<>();
        for(String j : allarticles){
            List<ComponentExplosion> partials = usageController.getUsageofComponent(j);
            for(ComponentExplosion partial : partials ){results.add(partial);}

        }

        Material search_material = materialRepository.findById(id).get();
        String brandname = search_material.getBrandname();

        String resultstringified="Products containing material "+brandname+":<br>";
        HashSet<Integer> product_set = new HashSet<>();
        for(ComponentExplosion ce: results){
            if(ce.isAssembly()) product_set.add(ce.getId());
        }
        for(Integer i: product_set){
            
            String product_code = productRepository.findById(i).get().getCode();
            String product_description = productRepository.findById(i).get().getDescription();
            resultstringified+="<br>";
            resultstringified+=product_code + " - " + product_description;
            
        }

        //convert results to string
        //return usageController.stringifyResults(results, brandname, 3);       
        System.out.println(resultstringified); 
        return resultstringified;
        
    }


}
