package com.app.compliance.controller;

import com.app.compliance.dto.DocumentView;
import com.app.compliance.model.Component;
import com.app.compliance.model.Document;
import com.app.compliance.model.Product;
import com.app.compliance.model.Component.ComponentFamily;
import com.app.compliance.model.Product.SterilizationCycle;
import com.app.compliance.repository.ComponentRepository;
import com.app.compliance.repository.DocumentRepository;
import com.app.compliance.repository.ProductRepository;
import com.app.compliance.services.EmailSenderService;
import com.app.compliance.services.LogService;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.swing.text.html.Option;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/querydocs")
@RequiredArgsConstructor
public class DocumentController {

    @Autowired
    private final DocumentRepository documentRepository;

    @Autowired
    private final ComponentRepository componentRepository;

    @Autowired
    private final ProductRepository productRepository;

    @Autowired
    private LogService logService;

    @Autowired
    private EmailSenderService senderService;

    @GetMapping("/")
    public List<DocumentView>  getAllDocumentsFiltered(
                                          @RequestParam(required = false) String description,
                                          @RequestParam(required = false) String article,
                                          @RequestParam(required = false) String revision,
                                          @RequestParam(required = false) Boolean active,
                                          @RequestParam(required = false) Boolean wi,
                                          @RequestParam(required = false) Boolean intspec,
                                          @RequestParam(required = false) Boolean supplierspec,
                                          @RequestParam(required = false) String ppc,
                                          @RequestParam(required = true)  Integer page,
                                          @RequestParam(required = false) Boolean artwork,
                                          @RequestParam(required = false) Boolean tr,
                                          @RequestParam(required = false) Boolean dd,
                                          @RequestParam(required = false) Boolean dhr,
                                          @RequestParam(required = false) Boolean ppcdoc
                                          
                                          ) {
                                 
        if(active==null) active=false;
        if(wi==null) wi=true;
        if(intspec==null) intspec=true;
        if(supplierspec==null) supplierspec=true;
        if(artwork==null) artwork=true;
        //ELIMINATE ALL THE RECORDS THAT DO NOT MATCH WITH THE PARAMETERS REQUESTED
        List<DocumentView> toRemove = new ArrayList<>();
        
        
        
        List<Object[]> resultobjects = documentRepository.getDocumentViews();

        List<DocumentView> alldocs = getDocumentViews((resultobjects));     
        //EXCEUTE ONE FILTER AT A TIME BUT ONLY IF REQUESTED
        if(active){
            for(DocumentView doc : alldocs){
                if(!doc.isActive()) toRemove.add(doc);
            }
            alldocs.removeAll(toRemove);
            toRemove.clear();
        }
        for(DocumentView doc : alldocs){
            if (doc.getDocumentType().equals("WI") && !wi) {toRemove.add(doc); continue;}
            else if (doc.getDocumentType().equals("InternalSpecification") && !intspec) {toRemove.add(doc); continue;}
            else if (doc.getDocumentType().equals("SupplierSpecification") && !supplierspec) {toRemove.add(doc); continue;} 
            else if (doc.getDocumentType().equals("ARTWORK") && !artwork) {toRemove.add(doc); continue;} 
            
        }
        alldocs.removeAll(toRemove);
        toRemove.clear();

        if(revision!=null){
            for (DocumentView doc : alldocs){
                if(!doc.getRevision().toUpperCase().contains(revision.toUpperCase())) toRemove.add(doc);            
            }
            alldocs.removeAll(toRemove);
            toRemove.clear(); 
        }

        if(article!=null){
            for (DocumentView doc : alldocs){
                if(!doc.getId().toUpperCase().contains(article.toUpperCase())) toRemove.add(doc);      
            }
            alldocs.removeAll(toRemove);
            toRemove.clear(); 
        }

        if(ppc!=null && ppc!=""){
            for (DocumentView doc : alldocs){
                if(doc.getPpc()==null || !doc.getPpc().toUpperCase().contains(ppc.toUpperCase())) toRemove.add(doc);
            }
            alldocs.removeAll(toRemove);
            toRemove.clear();
        }
        if(description!=null && description!=""){
            for (DocumentView doc : alldocs){
                if(doc.getDescription()!=null) if(!doc.getDescription().toUpperCase().contains(description.toUpperCase())) toRemove.add(doc);
            }
            alldocs.removeAll(toRemove);
            toRemove.clear();
        }

                
        //REMOVE ITEM WITHOUT DESCIPTION IF A SPECIFIC DESCRIPTION QUERY IS INSERTED
        if(description!=null && description !=""){
            toRemove.clear();
            for(DocumentView doc: alldocs){
                try{
                    String  typeofdoc = doc.getDescription().getClass().getSimpleName();
                }
                catch(Exception e){
                    toRemove.add(doc);
                }
            }   
            alldocs.removeAll(toRemove);
        }
        



        // return alldocs;
        return alldocs.stream()
                .filter(doc -> alldocs.indexOf(doc) >= (page-1)*50 && alldocs.indexOf(doc) <= (page*50)-1)
                .collect(Collectors.toList());

    }

    

    @GetMapping("/getnextrev")
    public String getDescriptionDocuments(@RequestParam("article") String article,
                                          @RequestParam("type") String documenttype
                                          ) {
        Document.DocumentType actualtype = null;
        if (documenttype.equals("internal")) actualtype= Document.DocumentType.InternalSpecification;
        else if (documenttype.equals("supplier")) actualtype= Document.DocumentType.SupplierSpecification;
        else if (documenttype.equals("wi")) actualtype= Document.DocumentType.WI;

        //THIS CALL IS USED WHEN GENERATING A NEW DOC TO AUTOMATICALLY TO LOAD THE CORRECT REVISION
        try {
//            Component comp= componentRepository.findByCompid(article);
            Document latestspec = documentRepository.findByArticlecodeAndActiveAndDocumenttype(article, true, actualtype);
            String latestrev = latestspec.getRevision();
            int charValue = latestrev.charAt(0);
            String next = String.valueOf((char) (charValue + 1));
            return next;
        }
        catch(Exception e){
            return "A";
        }


    }

    @PostMapping("/new")
    public ResponseEntity<String> createNewDocument(
            @RequestParam("article") String article,
            @RequestParam("revision") String revision,
            @RequestParam(required = false) String ppc,
            @RequestParam(required = false) String description,
            @RequestParam("active") boolean active,
            @RequestParam("assembly") boolean assembly,
            @RequestParam("type") String type,
            @RequestPart("docfile") MultipartFile file,
            @RequestHeader(name = "Authorization") String token) {

        if (file != null && !file.isEmpty()) {
            // Create the new Document object
            Document document = new Document();
            Document.DocumentType convertedType = null;
            switch (type) {
                case "internal" -> convertedType= Document.DocumentType.InternalSpecification;
                case "supplier" -> convertedType= Document.DocumentType.SupplierSpecification;
                case "wi" -> convertedType= Document.DocumentType.WI;
                case "artwork" -> convertedType= Document.DocumentType.ARTWORK;
            }

            
            //CHECK THAT THERE IS NO DUPLICATE
            Optional<Document> opt_doc=documentRepository.findByArticlecodeAndRevisionAndDocumenttype(article, revision, convertedType);
            if(opt_doc.isPresent()) return ResponseEntity.status(501).body("Document is already present");    

            //CHECK IF THE COMPONENT / PRODUCT ALREADY EXISTS OR NEEDS TO BE CREATED
            boolean toBeCreated=false;
            if(assembly){
                Optional<Product> opt_product = productRepository.findByCode(article);
                if(!opt_product.isPresent()) toBeCreated=true;
            }
            else{
                Component comp = componentRepository.findByCompid(article);
                if(comp==null) toBeCreated=true;
            }
            if(toBeCreated) if(description==null || description=="") return ResponseEntity.status(502).body("No description given");
            if(toBeCreated && assembly){
                Product new_prod = new Product();
                new_prod.setCode(article);
                new_prod.setDescription(description);
                new_prod.setIntercompany(false);
                new_prod.setSemifinished(false);
                new_prod.setSterilizationcycle(SterilizationCycle.BULK);
                productRepository.save(new_prod);       
                try{        
                // senderService.sendEmail("marcello.mazzuolo@bbraun.com", "New Product Created", "The product "+article+" has been created, please fill all the fields");
                // senderService.sendEmail("nella.trinchini_ext@bbraun.com", "New Product Created", "The product "+article+" has been created, please fill all the fields");
                // senderService.sendEmail("laura.carbone@bbraun.com", "New Product Created", "The product "+article+" has been created, please fill all the fields");
                // senderService.sendEmail("andrea.gallo@bbraun.com", "New Product Created", "The product "+article+" has been created, please fill all the fields");
                // senderService.sendEmail("alessandra.castorio_ext@bbraun.com", "New Product Created", "The product "+article+" has been created, please fill all the fields");
                } catch (Exception e) {
                    System.out.println("Error sending email: " + e);
                }
            }
            else if(toBeCreated && !assembly){
                Component new_comp = new Component();
                new_comp.setComp_id(article);
                new_comp.setDescription(description);
                new_comp.setIntercompany(false);
                new_comp.setBaimold(false);
                new_comp.setCa65(false);
                new_comp.setContact(false);
                new_comp.setFamily(ComponentFamily.ADJUVANTS);
                componentRepository.save(new_comp);
                try{        
                    // senderService.sendEmail("marcello.mazzuolo@bbraun.com", "New Component Created", "The component "+article+" has been created, please fill all the fields");
                    // senderService.sendEmail("nella.trinchini_ext@bbraun.com", "New Component Created", "The component "+article+" has been created, please fill all the fields");
                    // senderService.sendEmail("laura.carbone@bbraun.com", "New Component Created", "The component "+article+" has been created, please fill all the fields");
                    // senderService.sendEmail("andrea.gallo@bbraun.com", "New Component Created", "The component "+article+" has been created, please fill all the fields");
                    // senderService.sendEmail("alessandra.castorio_ext@bbraun.com", "New Component Created", "The component "+article+" has been created, please fill all the fields");
                    } catch (Exception e) {
                        System.out.println("Error sending email: " + e);
                    }
            }
                    
            //Save the file with the correct name and path
            try {
                //PUT Previous revisions of the document to non-active
                List<Document> olddocuments= documentRepository.findByArticlecodeAndDocumenttype(article, convertedType);
                for (Document olddoc : olddocuments) {
                    olddoc.setActive(false);
                }
                documentRepository.saveAll(olddocuments);
                //Save the new document with active state
                document.setDocumenttype(convertedType);
                document.setRevision(revision);
                document.setActive(active);
                document.setAssembly(assembly);
                document.setPpc(ppc);
                document.setArticlecode(article);
                //-----------------------------------------------------
                documentRepository.save(document);
                String SERVER_LOCATION = "C:/Program Files/MedDataHub/documentfolder";
                String EXTENSION = ".pdf";
                String typestring = null;
                switch (type) {
                    case "internal" -> typestring = "INTERNALSPECIFICATION";
                    case "supplier" -> typestring = "SUPPLIERSPECIFICATION";
                    case "wi" -> typestring = "WI";
                    case "artwork" -> typestring = "ARTWORK";
                }
                String fileName = article + "_" + revision + "_" + typestring + EXTENSION;
                Path destination = new File(SERVER_LOCATION, fileName).toPath();
                Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
                logService.writeToLog("Added the new document:  "+fileName,token);
            }
            catch (IOException e) {
                return ResponseEntity.status(500).body("Failed to save the file");
            }
        }

        return ResponseEntity.ok("New doc created successfully!");
    }

    public List<DocumentView> getDocumentViews(List<Object[]> results) {

        List<DocumentView> documentViews = new ArrayList<DocumentView>();
        for (Object[] result : results) {



            String id = getStringValue(result[0]);
            String description = getStringValue(result[1]);
            String revision = getStringValue(result[2]);
            String documentType = getStringValue(result[3]);
            String ppc = getStringValue(result[4]);
            boolean active= (boolean) result[5];




            documentViews.add(new DocumentView(id, description, revision, documentType, ppc, active));
        }
        return documentViews;
    }
    private String getStringValue(Object value) {
        return (value != null) ? value.toString() : null;
    }

    @PostMapping("/replace")
    public ResponseEntity<String> replaceDocument(
            @RequestPart("docfile") MultipartFile file,
            @RequestHeader(name = "Authorization") String token) {
                
        if (file == null || file.isEmpty()) return ResponseEntity.status(500).body("No file found");
            
            try {
                String oldFilename = file.getOriginalFilename();
                if(!isFilenameValid(oldFilename))  return ResponseEntity.status(500).body("Invalid file name");
                String SERVER_LOCATION = "C:/Program Files/MedDataHub/documentfolder";
                Path destination = new File(SERVER_LOCATION, oldFilename).toPath();
                Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
                logService.writeToLog("Replaced the file "+oldFilename,token);
            }
            catch (IOException e) {
                System.out.println(e);
                return ResponseEntity.status(500).body("Failed to save the file");
            }
        

        return ResponseEntity.ok("Doc replaced successfully!");
    }


    public static boolean isFilenameValid(String input) {
        String[] parts = input.split("_");        
        if (parts.length != 3) return false;    
        String secondPart = parts[2];
        return secondPart.equalsIgnoreCase("INTERNALSPECIFICATION.PDF") || secondPart.equalsIgnoreCase("WI.PDF") || secondPart.equalsIgnoreCase("SUPPLIERSPECIFICATION,PDF") || secondPart.equalsIgnoreCase("ARTWORK.PDF");
    }

}
