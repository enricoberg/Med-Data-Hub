package com.app.compliance.controller;


import com.app.compliance.dto.CompUpdate;
import com.app.compliance.dto.SupUpdate;
import com.app.compliance.model.Component;
import com.app.compliance.model.Component.ComponentFamily;
import com.app.compliance.model.Component.ConicalStandard;
import com.app.compliance.model.Supplier;
import com.app.compliance.repository.SupplierRepository;
import com.app.compliance.services.LogService;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/querysup")
@RequiredArgsConstructor
public class SupplierController {

    @Autowired
    private final SupplierRepository supplierRepository;

    @Autowired
    private final LogService logService;

    @GetMapping("/")
    public List<Supplier> getAllSuppliersFiltered(
            @RequestParam(required = false) String sapcode,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String contact
    ) {


        List<Supplier> allsups = supplierRepository.findAll();
        List<Supplier> toRemove = new ArrayList<>();
        //ELIMINATE ALL THE RECORDS THAT DO NOT MATCH WITH THE PARAMETERS REQUESTED
        for (Supplier s : allsups) {
            if (name != null && !s.getSupplier_name().toUpperCase().contains(name.toUpperCase())) toRemove.add(s);
            else if (sapcode != null && !s.getSap_code().toUpperCase().contains(sapcode.toUpperCase())) toRemove.add(s);
            else {
                if (contact != null && !contact.isBlank())  {
                    if(s.getContact() == null) toRemove.add(s);
                    else if(!s.getContact().toUpperCase().contains(contact.toUpperCase())) toRemove.add(s);
                
                }
            }

        }

        allsups.removeAll(toRemove);
        return allsups;

    }

    @PostMapping("/new")
    public ResponseEntity<String> createNewSupplier(
            @RequestParam("name") String name,
            @RequestParam("sap") String sap,
            @RequestParam("contact") String contact,
            @RequestHeader(name = "Authorization") String token) {

        
        
        try {
            // Create the new Supplier object
            Supplier supplier = new Supplier();
            supplier.setSupplier_name(name);
            supplier.setSap_code(sap);            
            if(!contact.isBlank()) supplier.setContact(contact);
            
            //Save the newly created supplier
            supplierRepository.save(supplier);
            logService.writeToLog("Added the new supplier:  "+name,token);
        } catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.status(500).body("Failed to add the new supplier");
        }
        return ResponseEntity.ok("New supplier created successfully!");
    }

    @GetMapping("/byid")
    public Optional<Supplier> RetrieveSupplier(@RequestParam("id") Integer id) {
        return supplierRepository.findById(id);
    }

    //RETURNS SUPPLIERS BASED ON AN ARRAY OF IDs 
    @GetMapping("/bylistofcodes")
    public List<Supplier> getSupByIds(@RequestParam List<Integer> articles) {
        List<Supplier> allsuppliers = new ArrayList<>();
        for(Integer article : articles){                       
            if (supplierRepository.existsById(article)) {
                Supplier supplier = supplierRepository.findById(article).get();
                allsuppliers.add(supplier);
            }          
                        
        }
        return allsuppliers;
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteSupplier(@PathVariable Integer id,@RequestHeader(name = "Authorization") String token) {
        try{
            supplierRepository.deleteById(id);
            logService.writeToLog("Deleted supplier with ID "+id,token);
        }catch(Exception e ){
            return ResponseEntity.status(500).body("Failed to delete the supplier");
        }
        return ResponseEntity.ok("Supplier deleted successfully");
    }

    @PutMapping("/updatesupplier/{id}")
    //THIS CONTROLLER SEARCHES FOR EXISTING SUPPLIER WITH SPECIFIED ID AND OVERWRITES THE PARAMETERS
    public ResponseEntity<String> updateSupplier(@PathVariable Integer id, @RequestBody SupUpdate updateSupplierRequest,@RequestHeader(name = "Authorization") String token){
        //VERIFY THE COMPONENT EXISTS
        
        Optional<Supplier> opt_supplier = supplierRepository.findById(id);
        if(!opt_supplier.isPresent()) return ResponseEntity.status(500).body("The supplier you requested to update does not exist");
        Supplier supplier = opt_supplier.get();       
        //CHANGE ONLY THE PARAMETERS SENT WITH THE REQUEST

        supplier.setSap_code(updateSupplierRequest.getSapcode());
        if(updateSupplierRequest.getContact().equals("NULL") || updateSupplierRequest.getContact().equals(" ") || updateSupplierRequest.getContact().equals("")) supplier.setContact(null);
        else supplier.setContact(updateSupplierRequest.getContact());
        supplier.setSupplier_name(updateSupplierRequest.getName());
        supplierRepository.save(supplier);        
        logService.writeToLog("Updated supplier with ID "+id+", Name: "+supplier.getSupplier_name()+", SAP code: "+supplier.getSap_code()+", Contact: "+supplier.getContact(),token);
        
        return ResponseEntity.ok("Supplier updated successfully");
    }


}
