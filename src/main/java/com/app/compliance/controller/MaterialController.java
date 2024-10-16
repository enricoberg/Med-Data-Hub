package com.app.compliance.controller;


import com.app.compliance.dto.CompUpdate;
import com.app.compliance.dto.ComponentExplosion;
import com.app.compliance.dto.MatUpdate;
import com.app.compliance.model.Component;
import com.app.compliance.model.Component.ComponentFamily;
import com.app.compliance.model.Component.ConicalStandard;
import com.app.compliance.model.Material.MaterialFamily;
import com.app.compliance.model.Material;
import com.app.compliance.model.MaterialConfiguration;
import com.app.compliance.model.Supplier;
import com.app.compliance.repository.BomRepository;
import com.app.compliance.repository.ComponentRepository;
import com.app.compliance.repository.ConfigurationRepository;
import com.app.compliance.repository.MaterialConfigurationRepository;
import com.app.compliance.repository.MaterialRepository;
import com.app.compliance.repository.ProductRepository;
import com.app.compliance.services.LogService;
import com.app.compliance.services.UsageController;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Comparator;
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

    @Autowired
    private LogService logService;

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
            else if (supplier != null && !supplier.isEmpty() && !supplier.equals("")){
                if(!m.getSupplier().toUpperCase().contains(supplier.toUpperCase())) toRemove.add(m);
            } 
                

        }

        allmats.removeAll(toRemove);
        allmats.sort(Comparator.comparing(material -> material.getBrandname(), String.CASE_INSENSITIVE_ORDER));
        return allmats;
       

    }

    @PostMapping("/new")
    public ResponseEntity<String> createNewMaterial(
            @RequestParam("name") String name,
            @RequestParam("supplier") String supplier,
            @RequestParam("plasticizer") String plasticizer,
            @RequestPart("family") String fam,
            @RequestHeader(name = "Authorization") String token) {


        // Create the new Material object
        Material material = new Material();
        Material.MaterialFamily family = Material.MaterialFamily.valueOf(fam);
        material.setBrandname(name);
        material.setSupplier(supplier);
        if(plasticizer=="" || plasticizer.isEmpty()) material.setPlasticizer(null);
        else material.setPlasticizer(plasticizer);
        material.setFamily(family);


        //Save the Material to the database
        try {
            materialRepository.save(material);
            logService.writeToLog("Added the new material:  "+name,token);
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
        Integer k=0;
        List<ComponentExplosion> results =  new ArrayList<>();
        for(String j : allarticles){
            k++;
            // System.out.println(k+": "+j);
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
        
        return resultstringified;
        
    }

    //RETURNS COMPONENTS BASED ON AN ARRAY OF ARTICLES 
    @GetMapping("/bylistofcodes")
    public List<Material> getMatByNames(@RequestParam List<Integer> articles) {
        List<Material> allmaterials = new ArrayList<>();
        for(Integer id : articles){
            
           
            if (materialRepository.existsById(id)) {
                Material material = materialRepository.findById(id).get();
                allmaterials.add(material);
            }
            
            
            
        }
        return allmaterials;
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteMaterial(@PathVariable Integer id,@RequestHeader(name = "Authorization") String token) {
        try{
            materialRepository.deleteById(id);
            logService.writeToLog("Deleted material with ID "+id,token);
        }catch(Exception e ){
            return ResponseEntity.status(500).body("Failed to delete the material");
        }
        return ResponseEntity.ok("Material deleted successfully");
    }

    @PutMapping("/updatematerial/{id}")
    //THIS CONTROLLER SEARCHES FOR EXISTING COMPONENT WITHS SPECIFIED ID AND OVERWRITES THE PARAMETERS
    public ResponseEntity<String> updateMaterial(@PathVariable Integer id, @RequestBody MatUpdate updateMaterialRequest,@RequestHeader(name = "Authorization") String token){
        //VERIFY THE COMPONENT EXISTS        
        Optional<Material> opt_material = materialRepository.findById(id);
        if(!opt_material.isPresent()) return ResponseEntity.status(500).body("The material you requested to update does not exist");
        Material material = opt_material.get();    
        
        //CHANGE ONLY THE PARAMETERS SENT WITH THE REQUEST
        
        material.setBrandname(updateMaterialRequest.getBrandname());
        material.setSupplier(updateMaterialRequest.getSupplier());
        // if(updateMaterialRequest.getNotes().equals("NULL") || updateMaterialRequest.getNotes().equals("") || updateMaterialRequest.getNotes().equals(" ")) material.setNotes(null);
        // else material.setNotes(updateMaterialRequest.getNotes());
        if(updateMaterialRequest.getPlasticizer().equals("NULL") || updateMaterialRequest.getPlasticizer().equals("") || updateMaterialRequest.getPlasticizer().equals(" ")) material.setPlasticizer(null);
        else material.setPlasticizer(updateMaterialRequest.getPlasticizer());        
        Material.MaterialFamily family = MaterialFamily.valueOf(updateMaterialRequest.getFamily());
        material.setFamily(family);


        
        
        materialRepository.save(material);
        logService.writeToLog("Updated material with ID "+id+", Brandname: "+material.getBrandname()+", Supplier: "+material.getSupplier()+", Family: "+material.getFamily()+", Plasticizer: "+material.getPlasticizer(),token);
        return ResponseEntity.ok("Component updated successfully");
    }

}
