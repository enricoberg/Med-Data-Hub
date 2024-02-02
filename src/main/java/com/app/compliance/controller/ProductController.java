package com.app.compliance.controller;
import com.app.compliance.model.Product;
import com.app.compliance.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/queryprod")
@RequiredArgsConstructor
public class ProductController {

    @Autowired
    private final ProductRepository productRepository;

    @GetMapping("/")
    public List<Product> getAllProductsFiltered(
            @RequestParam(required = false) String article,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String intercompany,
            @RequestParam(required = false) String family,
            @RequestParam(required = false) String sapstatus,
            @RequestParam(required = false) String semifinished,
            @RequestParam(required = false) String dhf,
            @RequestParam(required = false) String rmf,
            @RequestParam(required = false) String budi,
            @RequestParam(required = false) String sterimethod,
            @RequestParam(required = false) String sterisite,
            @RequestParam(required = false) String shelflife



    ) {




        List<Product> allprods = productRepository.findAll();
        List<Product> toRemove=new ArrayList<>();

        for (Product p : allprods) {
            if (description!=null && !description.isEmpty() && !p.getDescription().toUpperCase().contains(description.toUpperCase())) toRemove.add(p);
            else if (article!=null && !article.isEmpty() && !p.getCode().toUpperCase().contains(article.toUpperCase())) toRemove.add(p);
            else if (shelflife!=null && !shelflife.isEmpty() && p.getShelflife()==null ) toRemove.add(p);
            else if (shelflife!=null && !shelflife.isEmpty() &&!String.valueOf(p.getShelflife()).contains(shelflife)) toRemove.add(p);
            else if (dhf!=null && !dhf.isEmpty() && p.getDhf()==null ) toRemove.add(p);
            else if (dhf!=null && !dhf.isEmpty() &&!p.getDhf().toUpperCase().contains(dhf.toUpperCase())) toRemove.add(p);
            else if (rmf!=null && !rmf.isEmpty() && p.getRmf()==null ) toRemove.add(p);
            else if (rmf!=null && !rmf.isEmpty() && !p.getRmf().toUpperCase().contains(rmf.toUpperCase())) toRemove.add(p);
            else if (budi!=null && !budi.isEmpty() && p.getBudi()==null ) toRemove.add(p);
            else if (budi!=null && !budi.isEmpty() && !p.getBudi().toUpperCase().contains(budi.toUpperCase())) toRemove.add(p);
            else if (semifinished!=null  && semifinished.equals("true") && !p.isSemifinished()) toRemove.add(p);
            else if (semifinished!=null  && semifinished.equals("false") && p.isSemifinished()) toRemove.add(p);
            else if (intercompany!=null && intercompany.equals("true") && !p.isIntercompany()) toRemove.add(p);
            else if (intercompany!=null  && intercompany.equals("false") && p.isIntercompany()) toRemove.add(p);
            else if (family!=null && !family.equals("all") && !p.getFamily().name().equals(family)) toRemove.add(p);
            else if (sapstatus!=null && !sapstatus.isEmpty() && !sapstatus.equals("all") && !p.getSapstatus().name().equals(sapstatus)) toRemove.add(p);
            else if (sterimethod!=null && !sterimethod.equals("all") && !p.getSterilizationcycle().name().toUpperCase().contains(sterimethod.toUpperCase())) toRemove.add(p);
            else if (sterisite!=null && !sterisite.isEmpty() && !sterisite.equals("all") && p.getSterilizationsite()==null ) toRemove.add(p);
            else if (sterisite!=null && !sterisite.equals("all") && !p.getSterilizationsite().name().toUpperCase().contains(sterisite.toUpperCase())) toRemove.add(p);






        }



        allprods.removeAll(toRemove);
        return allprods;

    }


}
