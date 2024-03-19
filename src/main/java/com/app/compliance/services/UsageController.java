package com.app.compliance.services;

import com.app.compliance.controller.BomController;
import com.app.compliance.dto.ComponentExplosion;
import com.app.compliance.model.Bom;
import com.app.compliance.model.Product;
import com.app.compliance.repository.BomRepository;
import com.app.compliance.repository.ComponentRepository;
import com.app.compliance.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


public class UsageController {

    
    private final BomRepository bomRepository;
    
    private final ComponentRepository componentRepository;
    
    private final ProductRepository productRepository;

    public UsageController(BomRepository bomRepository, ComponentRepository componentRepository, ProductRepository productRepository) {
        this.bomRepository = bomRepository;
        this.componentRepository = componentRepository;
        this.productRepository = productRepository;
    }

    public List<ComponentExplosion> getUsageofComponent(String article) {

        List<ComponentExplosion> results =  new ArrayList<>();
        boolean exit=false;
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
                        newcompexplosion.setAssembly(true);
                        newcompexplosion.setLevel(level);
                        newcompexplosion.setControlled(false);
                        try{
                            results.add(results.indexOf(c)+1,newcompexplosion);
                        }
                        catch(Exception e){
                            System.out.println("ERROR");
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
            exit=true;
            for(ComponentExplosion c: results){
                if(!c.isControlled()) {
                    exit=false;
                    break;
                }
            }
        }
        return results;
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

    public String stringifyResults(List<ComponentExplosion> results, String article, Integer type_mbom){
        String resultstring="";
        if(type_mbom==2) resultstring="Full bill of materials for article code "+article+":";
        else if(type_mbom==1) resultstring ="Usage of article code "+article+":";
        else if(type_mbom==3) resultstring ="Products containing material "+article+":";


        for(ComponentExplosion ce : results){
            
            resultstring+="<br>";
            for(Integer i = 0 ; i< ce.getLevel();i++){
                resultstring+="&nbsp;&nbsp;";
            }
            resultstring+=getArticleOfComponentExplosion(ce);
        }
        return resultstring;

}


public List<ComponentExplosion> multilevelBom(String article){
       List<ComponentExplosion> results =  new ArrayList<>();
       boolean exit=false;
       Integer codetosearch;
       codetosearch=productRepository.findByCode(article).get().getId();

       Integer level=1;
       ComponentExplosion first_element= new ComponentExplosion();
       first_element.setLevel(level);
       first_element.setId(codetosearch);
       first_element.setAssembly(true);
       first_element.setControlled(false);
       results.add(first_element);

       while(!exit){
           boolean assembly;
           for(ComponentExplosion c: results) {
               if(c.isControlled()) continue;
               codetosearch=c.getId();
               assembly=c.isAssembly();
               level=c.getLevel()+1;
               if(!assembly) {
                   c.setControlled(true);
                   continue;
               }

               List<Bom> bomresults = bomRepository.findByProdid(productRepository.findById(codetosearch).get());

               if (!bomresults.isEmpty()) {
                   for (Bom b : bomresults) {

                       Integer compid= b.getCompid();

                       ComponentExplosion newcompexplosion = new ComponentExplosion();
                       newcompexplosion.setId(compid);
                       newcompexplosion.setAssembly(b.isAssembly());
                       newcompexplosion.setLevel(level);
                       newcompexplosion.setControlled(false);
                       try{
                           results.add(results.indexOf(c)+1,newcompexplosion);

                       }
                       catch(Exception e){
                           System.out.println("ERROR");
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
           exit=true;
           for(ComponentExplosion c: results){
               if(!c.isControlled()) {
                   exit=false;
                   break;
               }
           }


       }
       return results;

}
}
