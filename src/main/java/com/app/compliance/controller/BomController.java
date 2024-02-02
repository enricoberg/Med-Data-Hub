package com.app.compliance.controller;


import com.app.compliance.dto.BomView;
import com.app.compliance.dto.DocumentView;
import com.app.compliance.model.Bom;
import com.app.compliance.model.Component;
import com.app.compliance.repository.BomRepository;
import com.app.compliance.repository.ComponentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/queryboms")
@RequiredArgsConstructor
public class BomController {

    @Autowired
    private final BomRepository bomRepository;
    @Autowired
    private final ComponentRepository componentRepository;


    @GetMapping("/")
    public List<BomView> getAllBomsFiltered(
            @RequestParam(required = false) Integer article

    ) {

        List<Bom> notPertaining = new ArrayList<>();
        List<Bom> allboms = bomRepository.findAll();
        for (Bom b : allboms) {
            if (article!=null && !b.getProdid().getId().equals(article)) notPertaining.add(b);
        }
        allboms.removeAll(notPertaining);
        List<BomView> toRemove = new ArrayList<>();


        List<BomView> allbomsfiltered = getBomViews((allboms));
        for (BomView bom : allbomsfiltered) {

        }



        allbomsfiltered.removeAll(toRemove);
        return allbomsfiltered;

    }

    public List<BomView> getBomViews(List<Bom> results) {

        List<BomView> bomViews = new ArrayList<BomView>();
        for (Bom result : results) {
            String description= result.getCompid().getDescription();
            bomViews.add(new BomView(result.getCompid().getComp_id(),description,result.getQty(),result.getUm()));
        }
        return bomViews;
    }
    private String getStringValue(Object value) {
        return (value != null) ? value.toString() : null;
    }



}
