package com.app.compliance.controller;

import com.app.compliance.dto.DocumentView;
import com.app.compliance.model.Component;
import com.app.compliance.model.Document;
import com.app.compliance.repository.ComponentRepository;
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
            @RequestParam(required = false) String baimold

    ) {




        List<Component> allcomps = componentRepository.findAll();
        List<Component> toRemove=new ArrayList<>();

        for (Component c : allcomps) {
            if (description!=null && !c.getDescription().toUpperCase().contains(description.toUpperCase())) toRemove.add(c);
            else if (article!=null && !c.getComp_id().toUpperCase().contains(article.toUpperCase())) toRemove.add(c);
            else if (intercompany!=null && intercompany.equals("true") && !c.isIntercompany()) toRemove.add(c);
            else if (intercompany!=null  && intercompany.equals("false") && c.isIntercompany()) toRemove.add(c);
            else if (family!=null && !family.equals("all") && !c.getFamily().name().equals(family)) toRemove.add(c);
            else if (packaging!=null && packaging.equals("true") && !c.isPackagingmaterial()) toRemove.add(c);
            else if (packaging!=null && packaging.equals("false") && c.isPackagingmaterial()) toRemove.add(c);
            else if (contact!=null && contact.equals("true") && !c.isContact()) toRemove.add(c);
            else if (contact!=null && contact.equals("false") && c.isContact()) toRemove.add(c);
            else if (ca65!=null && ca65.equals("true") && !c.isCa65()) toRemove.add(c);
            else if (ca65!=null && ca65.equals("false") && c.isCa65()) toRemove.add(c);
            else if (baimold!=null && baimold.equals("true") && !c.isBaimold()) toRemove.add(c);
            else if (baimold!=null && baimold.equals("false") && c.isBaimold()) toRemove.add(c);
            else if (standard!=null && standard.equals("luer") && c.getStandard()==null) toRemove.add(c);
            else if (standard!=null && standard.equals("luer") && !c.getStandard().name().equals("LUERLOCK")) toRemove.add(c);
            else if (standard!=null && standard.equals("enfit") && c.getStandard()==null) toRemove.add(c);
            else if (standard!=null && standard.equals("enfit") && !c.getStandard().name().equals("ENFIT")) toRemove.add(c);
            else if (standard!=null && standard.equals("tpnlock") && c.getStandard()==null) toRemove.add(c);
            else if (standard!=null && standard.equals("tpnlock") && !c.getStandard().name().equals("TPNLOCK")) toRemove.add(c);




        }
        allcomps.removeAll(toRemove);
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
            if(!conicalstandard.equals("none")) {
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
            }
            catch (Exception e) { return ResponseEntity.status(500).body("Failed to save the component"); }
            return ResponseEntity.ok("New component created successfully!");
        }

        @GetMapping("/byid")
        public Optional<Component> RetrieveComponent(@RequestParam("article") Integer article) {            
            return componentRepository.findById(article);           
        }

    }






