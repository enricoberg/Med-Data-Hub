package com.app.compliance.controller;


import com.app.compliance.dto.BomRequest;
import com.app.compliance.dto.BomUpdate;
import com.app.compliance.dto.BomView;
import com.app.compliance.dto.CompUpdate;
import com.app.compliance.dto.ComponentExplosion;
import com.app.compliance.dto.DumpBomRequest;
import com.app.compliance.model.Bom;
import com.app.compliance.model.Component;
import com.app.compliance.model.Component.ComponentFamily;
import com.app.compliance.model.Component.ConicalStandard;
import com.app.compliance.model.Product;
import com.app.compliance.repository.BomRepository;
import com.app.compliance.repository.ComponentRepository;
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
import org.springframework.web.server.handler.ExceptionHandlingWebHandler;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/queryboms")
@RequiredArgsConstructor
public class BomController {

    @Autowired
    private final BomRepository bomRepository;
    @Autowired
    private final ComponentRepository componentRepository;
    @Autowired
    private final ProductRepository productRepository;

    @Autowired
    private LogService logService;



    @GetMapping("/")
    public List<BomView> getAllBomsFiltered(
            @RequestParam(required = false) Integer article
    ) {

        List<Bom> notPertaining = new ArrayList<>();
        List<Bom> allboms = bomRepository.findAll();
        for (Bom b : allboms) {
            if (article != null && !b.getProdid().getId().equals(article)) notPertaining.add(b);
        }
        allboms.removeAll(notPertaining);
        List<BomView> allbomsfiltered = getBomViews((allboms));
        return allbomsfiltered;

    }

    @GetMapping("/full")
    public List<Bom> getAllBomsFull(
            @RequestParam(required = false) Integer article
    ) {

        List<Bom> notPertaining = new ArrayList<>();
        List<Bom> allboms = bomRepository.findAll();
        for (Bom b : allboms) {
            if (article != null && !b.getProdid().getId().equals(article)) notPertaining.add(b);
        }
        allboms.removeAll(notPertaining);        
        return allboms;

    }

    public List<BomView> getBomViews(List<Bom> results) {

        List<BomView> bomViews = new ArrayList<BomView>();
        for (Bom result : results) {
            Integer compid=result.getCompid();
            String description="";
            String articlename="";
            if(result.isAssembly()) {
                description=productRepository.findById(compid).get().getDescription();
                articlename= productRepository.findById(compid).get().getCode();
            }
            else {
                description=componentRepository.findById(compid).get().getDescription();
                articlename= componentRepository.findById(compid).get().getComp_id();
            }
            bomViews.add(new BomView(articlename, description, result.getQty(), result.getUm(),result.isAssembly(),result.getId()));
        }
        return bomViews;
    }

    private String getStringValue(Object value) {
        return (value != null) ? value.toString() : null;
    }

    @PostMapping("/new")
    public ResponseEntity<String> createNewBomItem(@RequestBody BomRequest[] bomObjects,@RequestHeader(name = "Authorization") String token) {

        try {

            for (BomRequest obj : bomObjects) {
                
                // Optional<Product> opt_product = productRepository.findById(obj.getProdid());    
                // System.out.println(opt_product.get().getId());
                // System.out.println(obj.getCompid());            
                // Optional<Bom> bom = bomRepository.findByProdidAndCompid(opt_product.get(), obj.getCompid());



                
                // if(bom.isPresent()) throw new Exception("Component already present in the bom");                
                if(!productRepository.existsById(obj.getProdid())) throw new Exception("No product retrieved");
                String component_code;   
                            
                if(obj.isAssembly()){
                    if(!productRepository.findById(obj.getCompid()).isPresent()) throw new Exception("No product retrieved");
                    Product product = productRepository.findById(obj.getCompid()).get();
                    component_code=product.getCode();
                }
                else{
                    if(!componentRepository.existsById(obj.getCompid())) throw new Exception("No component retrieved");
                    Component component = componentRepository.findById(obj.getCompid()).get();
                    component_code=component.getComp_id();
                }
                Product product = productRepository.findById(obj.getProdid()).get();
                
                Bom.UnitMeasure um = Bom.UnitMeasure.valueOf(obj.getUm());
                float qty = obj.getQty();
                Bom bomline = new Bom();
                
                bomline.setCompid(obj.getCompid());
                bomline.setAssembly(obj.isAssembly());
                bomline.setProdid(product);
                bomline.setQty(qty);
                bomline.setUm(um);
                bomRepository.save(bomline);
                
                logService.writeToLog("Added article "+component_code+" (assembly="+obj.isAssembly()+") to the BOM of Product: "+product.getCode()+", qty: "+qty+" "+um,token);

            }

        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(500).body("Failed to save the bom");
        }
        return ResponseEntity.ok("New bom created successfully!");
    }


    @GetMapping("/componentusage")
    public String whereIsComponentUsed(
            @RequestParam(required = true) String article
    ) {



        UsageController usageController = new UsageController(bomRepository, componentRepository, productRepository);
        List<ComponentExplosion> results =  usageController.getUsageofComponent(article);        
        return usageController.stringifyResults(results, article,1);

    }


    @GetMapping("/multilevelbom")
    public String explodeBOM(
            @RequestParam(required = false) String article
    ) {
 

        
        UsageController usageController = new UsageController(bomRepository, componentRepository, productRepository);
        List<ComponentExplosion> results =  usageController.multilevelBom(article);
        return usageController.stringifyResults(results, article,2);

    }

    public boolean isUsedAnywhere(Integer article, boolean assembly){
        Optional<List<Bom>> results =bomRepository.findByCompidAndAssembly(article,assembly);
        return results.isEmpty();
    }
    public boolean isComponent(String article){
        try {
            Optional<Product> product = productRepository.findByCode(article);
            if(product.isPresent()) return false;
        }
        catch(Exception e){
            return true;

        }
        return true;
    }

    public String getArticleOfComponentExplosion(ComponentExplosion c){
        if(c.isAssembly()) return productRepository.findById(c.getId()).get().getCode()+" - "+productRepository.findById(c.getId()).get().getDescription() ;
        else return componentRepository.findById(c.getId()).get().getComp_id()+" - "+componentRepository.findById(c.getId()).get().getDescription() ;

    }

    @GetMapping("/deletebom")
    public ResponseEntity<String> deleteBomItem(
        @RequestParam(required = true) String compid,
        @RequestParam(required = true) Integer prodid,
        @RequestParam(required = true) boolean assembly,
        @RequestParam(required = true) Integer id,
        @RequestHeader(name = "Authorization") String token
    ) {
        
        try{
            if(!productRepository.existsById(prodid)) throw new Exception();
            
            Product product = productRepository.findById(prodid).get();
            String productcode=product.getCode();
            String prod_description=product.getDescription();
            Integer comp_id;
            String article;
            if(assembly) {
                
                if(!productRepository.existsByCode(compid)) throw new Exception();
                
                Product component= productRepository.findByCode(compid).get();
                comp_id=component.getId();
                article=component.getCode();
            }
            else{
                
                if(!componentRepository.existsByCompid(compid)) throw new Exception();
                
                Component component = componentRepository.findByCompid(compid);
                comp_id=component.getId();
                article=component.getComp_id();
            }
            
            // Bom bom = bomRepository.findByCompidAndProdidAndAssembly(comp_id, product, assembly).get();
            Bom bom = bomRepository.findById(id).get();
            bomRepository.delete(bom);
            logService.writeToLog("Deleted article "+article+" (assembly="+assembly+") from the BOM of Product: "+productcode+" - "+prod_description,token);
            
        }catch(Exception e ){
            return ResponseEntity.status(500).body("Failed to delete the component: "+e);
        }
        return ResponseEntity.ok("Component deleted successfully");
    }


    @PutMapping("/update/{id}")
    //THIS CONTROLLER SEARCHES FOR EXISTING COMPONENT WITHS SPECIFIED ID AND OVERWRITES THE PARAMETERS
    public ResponseEntity<String> updateComponent(@PathVariable Integer id, @RequestBody BomUpdate updateBomRequest,@RequestHeader(name = "Authorization") String token){
        try{
        //VERIFY THE COMPONENT EXISTS
        boolean assembly=updateBomRequest.isAssembly();
        Integer comp_id;
        String comp_article;
        if(assembly){
            if(productRepository.existsByCode(updateBomRequest.getArticle())){
                comp_id=productRepository.findByCode(updateBomRequest.getArticle()).get().getId();
                comp_article=productRepository.findByCode(updateBomRequest.getArticle()).get().getCode();
            } 
            else throw new Exception();
        }
        else{
            if(componentRepository.existsByCompid(updateBomRequest.getArticle())) {
                comp_id=componentRepository.findByCompid(updateBomRequest.getArticle()).getId();
                comp_article=componentRepository.findByCompid(updateBomRequest.getArticle()).getComp_id();
            }
            else throw new Exception();
        }
        if(!productRepository.existsById(id)) throw new Exception();
        Product product = productRepository.findById(id).get();
        Optional<Bom> opt_bom = bomRepository.findByCompidAndProdidAndAssembly(comp_id, product, assembly); 
        //CHANGE ONLY THE PARAMETERS SENT WITH THE REQUEST
        if(!opt_bom.isPresent()) throw new Exception();
        Bom bom = opt_bom.get();
        bom.setAssembly(assembly);
        bom.setQty(updateBomRequest.getQty());
        Bom.UnitMeasure um = Bom.UnitMeasure.valueOf(updateBomRequest.getUm());
        bom.setUm(um);
        bomRepository.save(bom);    
        logService.writeToLog("Updated BOM element. Component "+comp_article+"(assembly="+assembly+"), Product: "+product.getCode()+", qty: "+updateBomRequest.getQty()+" "+um,token);   
    }
    catch(Exception e){
        return ResponseEntity.status(500).body("Failed to delete the component: "+e);
    }
        return ResponseEntity.ok("BOM updated successfully");
    }

    

    @PostMapping("/pastefromclipboard")
    public String gpasteBoms(@RequestBody DumpBomRequest[]  bomObjects,@RequestHeader(name = "Authorization") String token)
    {




        return "ok";
    }
}
