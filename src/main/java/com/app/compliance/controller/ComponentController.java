package com.app.compliance.controller;

import com.app.compliance.dto.DocumentView;
import com.app.compliance.model.Component;
import com.app.compliance.repository.ComponentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

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





}
