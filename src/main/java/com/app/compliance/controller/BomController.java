package com.app.compliance.controller;


import com.app.compliance.dto.BomRequest;
import com.app.compliance.dto.BomView;
import com.app.compliance.dto.ComponentExplosion;
import com.app.compliance.model.Bom;
import com.app.compliance.model.Component;
import com.app.compliance.model.Product;
import com.app.compliance.repository.BomRepository;
import com.app.compliance.repository.ComponentRepository;
import com.app.compliance.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;


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
            bomViews.add(new BomView(articlename, description, result.getQty(), result.getUm()));
        }
        return bomViews;
    }

    private String getStringValue(Object value) {
        return (value != null) ? value.toString() : null;
    }

    @PostMapping("/new")
    public ResponseEntity<String> createNewBomItem(@RequestBody BomRequest[] bomObjects) {

        try {

            for (BomRequest obj : bomObjects) {

                Optional<Product> opt_product = productRepository.findById(obj.getProdid());
                Optional<Bom> bom = bomRepository.findByProdidAndCompid(opt_product.get(), obj.getCompid());

                if(bom.isPresent()) throw new Exception("Component already present in the bom");
                if(!componentRepository.existsById(obj.getCompid())) throw new Exception("No component retrieved");
                if(!productRepository.existsById(obj.getProdid())) throw new Exception("No product retrieved");

                Optional<Component> opt_component = componentRepository.findById(obj.getCompid());
                Product product = opt_product.get();

                Bom.UnitMeasure um = Bom.UnitMeasure.valueOf(obj.getUm());
                float qty = obj.getQty();
                Bom bomline = new Bom();
                bomline.setCompid(obj.getCompid());
                bomline.setAssembly(obj.isAssembly());
                bomline.setProdid(product);
                bomline.setQty(qty);
                bomline.setUm(um);

                bomRepository.save(bomline);

            }

        } catch (Exception e) {

            return ResponseEntity.status(500).body("Failed to save the bom");
        }
        return ResponseEntity.ok("New bom created successfully!");
    }


    @GetMapping("/componentusage")
    public String whereIsComponentUsed(
            @RequestParam(required = false) String article
    ) {
        List<ComponentExplosion> results =  new ArrayList<>();
        boolean exit=false;
        Integer count=0;
        boolean assembly=!isComponent(article);
        Integer codetosearch;
        if (assembly) codetosearch=productRepository.findByCode(article).get().getId();
        else codetosearch = componentRepository.findByCompid(article).getId();
        Integer level=1;
        ComponentExplosion first_element= new ComponentExplosion();
        first_element.setLevel(level);
        first_element.setId(codetosearch);
        first_element.setAssembly(assembly);
        first_element.setControlled(false);
        results.add(first_element);

        while(!exit){
            Integer initial_length= results.size();
            for(ComponentExplosion c: results) {
                if(c.isControlled()) continue;
                codetosearch=c.getId();
                assembly=c.isAssembly();
                level=c.getLevel()+1;


                List<Bom> bomresults = bomRepository.findByCompid(codetosearch);

                if (!bomresults.isEmpty()) {
                    for (Bom b : bomresults) {

                        Integer prodid= b.getProdid().getId();
                        ComponentExplosion newcompexplosion = new ComponentExplosion();
                        newcompexplosion.setId(prodid);
                        newcompexplosion.setAssembly(b.isAssembly());
                        newcompexplosion.setLevel(level);
                        newcompexplosion.setControlled(false);
                        try{
                            results.add(results.indexOf(c)+1,newcompexplosion);

                        }
                        catch(Exception e){
                            System.out.println("THIS IS WHERE I FAIL");
                        }


                    }
                    c.setControlled(true);
                    break;
                }
                else{
                    c.setControlled(true);
                    break;
                }


            }







           if(results.size()==initial_length) count+=1;
           if(count>20) exit=true;

        }


        String resultstring="Usage of article code "+article+":";
        for(ComponentExplosion ce : results){
            resultstring+="\n";
            for(Integer i = 0 ; i< ce.getLevel();i++){
                resultstring+="\t\t";
            }
            resultstring+=getArticleOfComponentExplosion(ce);

        }
        return resultstring;

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
        if(c.isAssembly()) return productRepository.findById(c.getId()).get().getCode();
        else return componentRepository.findById(c.getId()).get().getComp_id();

    }

}
