package com.app.compliance.controller;

import com.app.compliance.dto.CompUpdate;
import com.app.compliance.dto.DocumentView;
import com.app.compliance.dto.SignUpRequest;
import com.app.compliance.model.*;
import com.app.compliance.model.Component.ComponentFamily;
import com.app.compliance.repository.ComponentRepository;
import com.app.compliance.repository.ConfigurationRepository;
import com.app.compliance.repository.MaterialConfigurationRepository;
import com.app.compliance.repository.MaterialRepository;
import com.app.compliance.repository.SupplierRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/querycomp")
@RequiredArgsConstructor
public class ComponentController {

    @Autowired
    private final ComponentRepository componentRepository;

    @Autowired
    private final SupplierRepository supplierRepository;

    @Autowired
    private final MaterialRepository materialRepository;

    @Autowired
    private final ConfigurationRepository configurationRepository;

    @Autowired
    private final MaterialConfigurationRepository materialConfigurationRepository;

    @GetMapping("/")
    public List<Component> getAllComponentsFiltered(
            @RequestParam(required = false) String article,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String intercompany,
            @RequestParam(required = false) String family,
            @RequestParam(required = false) String standard,
            @RequestParam(required = false) String packaging,
            @RequestParam(required = false) String contact,
            @RequestParam(required = false) String ca65,
            @RequestParam(required = false) String baimold,
            @RequestParam(required = false) String contains,
            @RequestParam(required = false) String suppliedby

    ) {


        List<Component> allcomps = componentRepository.findAll();
        List<Component> toRemove = new ArrayList<>();
        //ELIMINATE ALL THE RECORDS THAT DO NOT MATCH WITH THE PARAMETERS REQUESTED
        for (Component c : allcomps) {
            if (description != null && !c.getDescription().toUpperCase().contains(description.toUpperCase()))
                toRemove.add(c);
            else if (article != null && !c.getComp_id().toUpperCase().contains(article.toUpperCase())) toRemove.add(c);
            else if (intercompany != null && intercompany.equals("true") && !c.isIntercompany()) toRemove.add(c);
            else if (intercompany != null && intercompany.equals("false") && c.isIntercompany()) toRemove.add(c);
            else if (family != null && !family.equals("all") && !c.getFamily().name().equals(family)) toRemove.add(c);
            else if (packaging != null && packaging.equals("true") && !c.isPackagingmaterial()) toRemove.add(c);
            else if (packaging != null && packaging.equals("false") && c.isPackagingmaterial()) toRemove.add(c);
            else if (contact != null && contact.equals("true") && !c.isContact()) toRemove.add(c);
            else if (contact != null && contact.equals("false") && c.isContact()) toRemove.add(c);
            else if (ca65 != null && ca65.equals("true") && !c.isCa65()) toRemove.add(c);
            else if (ca65 != null && ca65.equals("false") && c.isCa65()) toRemove.add(c);
            else if (baimold != null && baimold.equals("true") && !c.isBaimold()) toRemove.add(c);
            else if (baimold != null && baimold.equals("false") && c.isBaimold()) toRemove.add(c);
            else if (standard != null && standard.equals("luer") && c.getStandard() == null) toRemove.add(c);
            else if (standard != null && standard.equals("luer") && !c.getStandard().name().equals("LUERLOCK"))
                toRemove.add(c);
            else if (standard != null && standard.equals("enfit") && c.getStandard() == null) toRemove.add(c);
            else if (standard != null && standard.equals("enfit") && !c.getStandard().name().equals("ENFIT"))
                toRemove.add(c);
            else if (standard != null && standard.equals("tpnlock") && c.getStandard() == null) toRemove.add(c);
            else if (standard != null && standard.equals("tpnlock") && !c.getStandard().name().equals("TPNLOCK"))
                toRemove.add(c);


        }
        allcomps.removeAll(toRemove);
        //PERFORM THE OPTIONAL QUERY ON MATERIAL: LEAVE ONLY THE COMPONENT WITH AT LEAST ONE CONFIGURATION THAT CONTAINS THE MATERIAL
        allcomps= filterByMaterial(allcomps, contains);
        //PERFORM THE OPTIONAL QUERY ON SUPPLIER: LEAVE ONLY THE COMPONENT WITH AT LEAST ONE CONFIGURATION ASSOCIATED WITH THAT SUPPLIER
        allcomps= filterBySupplier(allcomps,suppliedby);
        return allcomps;
    }


    @PostMapping("/new")
    public ResponseEntity<String> createNewComponent(
            @RequestParam("article") String article,
            @RequestParam("description") String description,
            @RequestParam("intercompany") boolean intercompany,
            @RequestParam("packaging") boolean packaging,
            @RequestParam("contact") boolean contact,
            @RequestParam("ca65") boolean ca65,
            @RequestParam("baimold") boolean baimold,
            @RequestParam("standard") String conicalstandard,
            @RequestPart("family") String fam) {
        // Create the new Component object
        Component component = new Component();
        Component.ComponentFamily family = Component.ComponentFamily.valueOf(fam);
        if (!conicalstandard.equals("none")) {
            Component.ConicalStandard standard = Component.ConicalStandard.valueOf(conicalstandard);
            component.setStandard(standard);
        }
        component.setFamily(family);
        component.setComp_id(article);
        component.setDescription(description);
        component.setIntercompany(intercompany);
        component.setPackagingmaterial(packaging);
        component.setContact(contact);
        component.setCa65(ca65);
        component.setBaimold(baimold);
        //Save the file with the correct name and path
        try {
            componentRepository.save(component);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to save the component");
        }
        return ResponseEntity.ok("New component created successfully!");
    }

    @GetMapping("/byid")
    public Optional<Component> RetrieveComponent(@RequestParam("article") Integer article) {
        return componentRepository.findById(article);
    }

    @GetMapping("/byname")
    public Component RetrieveComponentByName(@RequestParam("id") String id) {
        return componentRepository.findByCompid(id);
    }

    //FUNCTION TO FILTER LIST OF COMPONENTS AND RETURNING ONLY THE ONLY ONES WITH SPECIFIC MATERIAL
    public List<Component> filterByMaterial (List<Component> allcomps, String contains){
        if(contains==null) return allcomps;
        if(contains.equals("all") ) return allcomps;
        List<Component> materialUnmatching = new ArrayList<>();
        Optional<Material> opt_materialid = materialRepository.findById(Integer.parseInt(contains));
        if(!opt_materialid.isPresent()) return allcomps;
        Integer materialid = opt_materialid.get().getId();
        for(Component c: allcomps){
            Integer componentid= c.getId();
            List<MaterialConfiguration> matchingmaterials = new ArrayList<>();
            List<Configuration> allconfs= configurationRepository.findByCompid(componentid);
            for(Configuration conf : allconfs){
                Integer confid= conf.getId();
                List<MaterialConfiguration> partialconfigmatching = materialConfigurationRepository.findByMaterialidAndConfid(materialid,confid);
                for(MaterialConfiguration p : partialconfigmatching){ matchingmaterials.add(p); }

            }
        Integer foundMatches = matchingmaterials.size();
        if (foundMatches==0) materialUnmatching.add(c);

        }
        allcomps.removeAll(materialUnmatching);

        return allcomps;

    }

    //FUNCTION TO FILTER LIST OF COMPONENTS AND RETURNING ONLY THE ONLY ONES WITH SPECIFIC SUPPLIER
    public List<Component> filterBySupplier (List<Component> allcomps, String suppliedby){
        if(suppliedby==null) return allcomps;
        if(suppliedby.equals("all") ) return allcomps;
        List<Component> supplierUnmatching = new ArrayList<>();
        Optional<Supplier> opt_supplierid = supplierRepository.findById(Integer.parseInt(suppliedby));
        if(!opt_supplierid.isPresent()) return allcomps;
        Integer supplierid = opt_supplierid.get().getId();
        for(Component c: allcomps){
            Integer componentid= c.getId();
            // List<MaterialConfiguration> matchingmaterials = new ArrayList<>();
            List<Configuration> allconfs= configurationRepository.findByCompid(componentid);
            boolean configsmatching=false;
            for(Configuration conf : allconfs){
                if(conf.getSupplier().getId()==supplierid) { 
                    configsmatching=true;
                    break;
                }              
            }
        if(!configsmatching) supplierUnmatching.add(c);        
        }
        allcomps.removeAll(supplierUnmatching);
        return allcomps;
    }


    //RETURNS COMPONENTS BASED ON AN ARRAY OF ARTICLES 
    @GetMapping("/bylistofcodes")
    public List<Component> getCompByNames(@RequestParam List<String> articles) {
        List<Component> allcomponents = new ArrayList<>();
        for(String article : articles){
            
           
            if (componentRepository.existsByCompid(article)) {
                Component component = componentRepository.findByCompid(article);
                allcomponents.add(component);
            }
            
            
            
        }
        return allcomponents;
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id) {
        try{
            componentRepository.deleteById(id);
        }catch(Exception e ){
            return ResponseEntity.status(500).body("Failed to delete the user");
        }
        return ResponseEntity.ok("User deleted successfully");
    }

    @PutMapping("/updatecomponent/{id}")
    //THIS CONTROLLER SEARCHES FOR EXISTING COMPONENT WITHS SPECIFIED ID AND OVERWRITES THE PARAMETERS
    public ResponseEntity<String> updateComponent(@PathVariable Integer id, @RequestBody CompUpdate updateComponentRequest){
        //VERIFY THE COMPONENT EXISTS
        
        Optional<Component> opt_component = componentRepository.findById(id);
        if(!opt_component.isPresent()) return ResponseEntity.status(500).body("The user you requested to update does not exist");
        Component component = opt_component.get();       
        //CHANGE ONLY THE PARAMETERS SENT WITH THE REQUEST
        component.setComp_id(updateComponentRequest.getArticle());
        component.setDescription(updateComponentRequest.getDescription());
        component.setIntercompany(updateComponentRequest.isIntercompany());
        component.setPackagingmaterial(updateComponentRequest.isPackaging());
        component.setCa65(updateComponentRequest.isCa65());
        Component.ComponentFamily compfamily = ComponentFamily.valueOf(updateComponentRequest.getFamily());
        component.setFamily(compfamily);
        componentRepository.save(component);
        
        return ResponseEntity.ok("Component updated successfully");
    }
}






