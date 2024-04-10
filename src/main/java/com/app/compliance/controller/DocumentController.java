package com.app.compliance.controller;

import com.app.compliance.dto.DocumentView;
import com.app.compliance.model.Component;
import com.app.compliance.model.Document;
import com.app.compliance.repository.ComponentRepository;
import com.app.compliance.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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

@RestController
@RequestMapping("/querydocs")
@RequiredArgsConstructor
public class DocumentController {

    @Autowired
    private final DocumentRepository documentRepository;

    @Autowired
    private final ComponentRepository componentRepository;

    @GetMapping("/")
    public List<DocumentView>  getAllDocumentsFiltered(
                                          @RequestParam(required = false) String description,
                                          @RequestParam(required = false) String article,
                                          @RequestParam(required = false) String revision,
                                          @RequestParam(required = false) Boolean active,
                                          @RequestParam(required = false) Boolean wi,
                                          @RequestParam(required = false) Boolean intspec,
                                          @RequestParam(required = false) Boolean supplierspec,
                                          @RequestParam(required = false) String ppc
                                          ) {
        if(active==null) active=false;
        if(wi==null) wi=true;
        if(intspec==null) intspec=true;
        if(supplierspec==null) supplierspec=true;

        //ELIMINATE ALL THE RECORDS THAT DO NOT MATCH WITH THE PARAMETERS REQUESTED
        List<DocumentView> toRemove = new ArrayList<>();
        List<Object[]> resultobjects = documentRepository.getDocumentViews();

        List<DocumentView> alldocs = getDocumentViews((resultobjects));

        for (DocumentView doc : alldocs) {
            if(active && !doc.isActive()) toRemove.add(doc);
            else if (doc.getDocumentType().equals("WI") && !wi) toRemove.add(doc);
            else if (doc.getDocumentType().equals("InternalSpecification") && !intspec) toRemove.add(doc);
            else if (doc.getDocumentType().equals("SupplierSpecification") && !supplierspec) toRemove.add(doc);
            else if (description!=null && !doc.getDescription().toUpperCase().contains(description.toUpperCase())) toRemove.add(doc);
            else if (revision!=null && !doc.getRevision().toUpperCase().contains(revision.toUpperCase())) toRemove.add(doc);
            else if (article!=null && !doc.getId().toUpperCase().contains(article.toUpperCase())) toRemove.add(doc);
            else if (ppc!=null && ppc!="") if(doc.getPpc()==null || !doc.getPpc().toUpperCase().contains(ppc.toUpperCase())) toRemove.add(doc);

        }



        alldocs.removeAll(toRemove);
        return alldocs;

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
            @RequestParam("ppc") String ppc,
            @RequestParam("active") boolean active,
            @RequestParam("assembly") boolean assembly,
            @RequestParam("type") String type,
            @RequestPart("docfile") MultipartFile file) {

        if (file != null && !file.isEmpty()) {
            // Create the new Document object
            Document document = new Document();
            Document.DocumentType convertedType = null;
            switch (type) {
                case "internal" -> convertedType= Document.DocumentType.InternalSpecification;
                case "supplier" -> convertedType= Document.DocumentType.SupplierSpecification;
                case "wi" -> convertedType= Document.DocumentType.WI;
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
                }
                String fileName = article + "_" + revision + "_" + typestring + EXTENSION;
                Path destination = new File(SERVER_LOCATION, fileName).toPath();
                Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
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



}
