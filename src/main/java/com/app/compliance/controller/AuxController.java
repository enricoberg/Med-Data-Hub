package com.app.compliance.controller;


import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;


import com.app.compliance.dto.DocumentView;
import com.app.compliance.dto.QuickSearch;
import com.app.compliance.entities.User;
import com.app.compliance.model.Product;
import com.app.compliance.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.compliance.model.Component;

import com.app.compliance.model.Material;
import com.app.compliance.model.Supplier;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/aux")
@RequiredArgsConstructor
public class AuxController {

    @Autowired
    private final ProductRepository productRepository;

    @Autowired
    private final SupplierRepository supplierRepository;

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final ComponentRepository componentRepository;

    @Autowired
    private final MaterialRepository materialRepository;

    @GetMapping("/getsuppliers")
    public List<Supplier> getAllSuppliers() {
        List<Supplier> allsups = supplierRepository.findAll();
        allsups.sort(Comparator.comparing(supplier -> supplier.getSupplier_name(), String.CASE_INSENSITIVE_ORDER));
        return allsups;
    }

    @GetMapping("/getcomponents")
    public List<Component> getAllComponents() {
        return componentRepository.findAll();
    }

    @GetMapping("/getsemifinished")
    public List<Product> getAllProductsSemifinished() {
        return productRepository.findBySemifinished(true);
    }

    @GetMapping("/getmaterials")
    public List<Material> getAllMaterial() {
        List<Material> allmats = materialRepository.findAll();
        allmats.sort(Comparator.comparing(material -> material.getBrandname(), String.CASE_INSENSITIVE_ORDER));
        return allmats;
    }

    @GetMapping("/getrole")
    public String getRole(@RequestParam("email") String email) {
        Optional<User> optuser = userRepository.findByEmail(email);
        if (!optuser.isPresent()) return null;
        User user = optuser.get();
        return user.getRole().toString();
    }

    @GetMapping("/getquicklink")
    public String getQuickSearch(@RequestParam("search") String search) {

        List<Object[]> allraw = componentRepository.findAllQuickLinks();
        List<QuickSearch> all = convertToQuickSearch((allraw));
        QuickSearch found = null;

        for(QuickSearch q : all){
            if(q.getArticle().toUpperCase().contains(search.toUpperCase())) {
                found=q;
                break;
            }

        }

        if(found==null) return "NONE";
        if(found.getType().equals("COMPONENT") && found.getField().equals("ARTICLE")) return "COMPART";
        else if(found.getType().equals("COMPONENT") && found.getField().equals("DESCRIPTION")) return "COMPDESC";
        else if(found.getType().equals("PRODUCT") && found.getField().equals("ARTICLE")) return "PRODART";
        else if(found.getType().equals("PRODUCT") && found.getField().equals("DESCRIPTION")) return "PRODDESC";
        else if(found.getType().equals("MATERIAL" )) return "MATERIAL";
        else if(found.getType().equals("SUPPLIER" )) return "SUPPLIER";
        return "NONE";
    }

    public List<QuickSearch> convertToQuickSearch(List<Object[]> results) {

        List<QuickSearch> views = new ArrayList<QuickSearch>();
        for (Object[] result : results) {



            String article = getStringValue(result[0]);
            String type = getStringValue(result[1]);
            String field = getStringValue(result[2]);





            views.add(new QuickSearch(article,type,field));
        }
        return views;
    }
    private String getStringValue(Object value) {
        return (value != null) ? value.toString() : null;
    }


}
