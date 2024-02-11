package com.app.compliance.controller;

import com.app.compliance.model.Component;
import com.app.compliance.model.Product;
import com.app.compliance.model.Supplier;
import com.app.compliance.model.Product.ProductFamily;
import com.app.compliance.repository.ProductRepository;
import com.app.compliance.repository.SupplierRepository;

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
import java.util.NoSuchElementException;
import java.util.Optional;

@RestController
@RequestMapping("/queryprod")
@RequiredArgsConstructor
public class ProductController {

    @Autowired
    private final ProductRepository productRepository;

    @Autowired
    private final SupplierRepository supplierRepository;

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
        List<Product> toRemove = new ArrayList<>();
        //ELIMINATE ALL THE RECORDS THAT DO NOT MATCH WITH THE PARAMETERS REQUESTED
        for (Product p : allprods) {
            if (description != null && !description.isEmpty() && !p.getDescription().toUpperCase().contains(description.toUpperCase()))
                toRemove.add(p);
            else if (article != null && !article.isEmpty() && !p.getCode().toUpperCase().contains(article.toUpperCase()))
                toRemove.add(p);
            else if (shelflife != null && !shelflife.isEmpty() && p.getShelflife() == null) toRemove.add(p);
            else if (shelflife != null && !shelflife.isEmpty() && !String.valueOf(p.getShelflife()).contains(shelflife))
                toRemove.add(p);
            else if (dhf != null && !dhf.isEmpty() && p.getDhf() == null) toRemove.add(p);
            else if (dhf != null && !dhf.isEmpty() && !p.getDhf().toUpperCase().contains(dhf.toUpperCase()))
                toRemove.add(p);
            else if (rmf != null && !rmf.isEmpty() && p.getRmf() == null) toRemove.add(p);
            else if (rmf != null && !rmf.isEmpty() && !p.getRmf().toUpperCase().contains(rmf.toUpperCase()))
                toRemove.add(p);
            else if (budi != null && !budi.isEmpty() && p.getBudi() == null) toRemove.add(p);
            else if (budi != null && !budi.isEmpty() && !p.getBudi().toUpperCase().contains(budi.toUpperCase()))
                toRemove.add(p);
            else if (semifinished != null && semifinished.equals("true") && !p.isSemifinished()) toRemove.add(p);
            else if (semifinished != null && semifinished.equals("false") && p.isSemifinished()) toRemove.add(p);
            else if (intercompany != null && intercompany.equals("true") && !p.isIntercompany()) toRemove.add(p);
            else if (intercompany != null && intercompany.equals("false") && p.isIntercompany()) toRemove.add(p);
            else if (family != null && !family.equals("all") && !p.getFamily().name().equals(family)) toRemove.add(p);
            else if (sapstatus != null && !sapstatus.isEmpty() && !sapstatus.equals("all") && !p.getSapstatus().name().equals(sapstatus))
                toRemove.add(p);
            else if (sterimethod != null && !sterimethod.equals("all") && !p.getSterilizationcycle().name().toUpperCase().contains(sterimethod.toUpperCase()))
                toRemove.add(p);
            else if (sterisite != null && !sterisite.isEmpty() && !sterisite.equals("all") && p.getSterilizationsite() == null)
                toRemove.add(p);
            else if (sterisite != null && !sterisite.equals("all") && !p.getSterilizationsite().name().toUpperCase().contains(sterisite.toUpperCase()))
                toRemove.add(p);


        }


        allprods.removeAll(toRemove);
        return allprods;

    }


    @PostMapping("/new")
    public ResponseEntity<String> createNewComponent(
            @RequestParam("article") String article,
            @RequestParam("description") String description,
            @RequestParam("dhf") String dhf,
            @RequestParam("rmf") String rmf,
            @RequestParam("budi") String budi,
            @RequestParam("shelf") String shelf,
            @RequestParam("intercompany") boolean intercompany,
            @RequestParam("semifinished") boolean semifinished,
            @RequestParam("sterimethod") String method,
            @RequestParam("sterisite") String site,
            @RequestParam("sap") String sap,
            @RequestParam("supplier") String supplier,
            @RequestPart("family") String fam) {


        try {
            // Create the new Product object
            Product product = new Product();
            Product.ProductFamily family = Product.ProductFamily.valueOf(fam);
            Product.SterilizationCycle sterimethod = Product.SterilizationCycle.valueOf(method);
            Product.SterilizationSite sterisite = Product.SterilizationSite.valueOf(site);
            Product.SapStatus sapstatus = Product.SapStatus.valueOf(sap);

            product.setCode(article);
            product.setDescription(description);
            if (!dhf.isEmpty()) product.setDhf(dhf);
            if (!rmf.isEmpty()) product.setRmf(rmf);
            if (!budi.isEmpty()) product.setBudi(budi);
            if (!shelf.isEmpty()) product.setShelflife(Integer.valueOf(shelf));

            product.setIntercompany(intercompany);
            product.setSemifinished(semifinished);
            product.setSterilizationcycle(sterimethod);
            product.setSterilizationsite(sterisite);
            product.setSapstatus(sapstatus);
            product.setFamily(family);
            Optional<Supplier> supp = supplierRepository.findById(Integer.valueOf(supplier));
            if (!supp.isPresent()) throw new NoSuchElementException("Supplier not found");
            Supplier actualsupp = supp.get();
            product.setSupplierid(actualsupp);
            //Save the product to the database
            productRepository.save(product);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to save the product");
        }
        return ResponseEntity.ok("New product created successfully!");
    }


    @GetMapping("/byid")
    public Optional<Integer> RetrieveProduct(@RequestParam("article") String article) {
        Optional<Product> opt_product = productRepository.findByCode(article);
        if (opt_product.isPresent()) {
            Product product = opt_product.get();
            return Optional.of(product.getId());
        }
        return Optional.empty();
    }

}
