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
            else if (ppc!=null && !doc.getPpc().toUpperCase().contains(ppc.toUpperCase())) toRemove.add(doc);

        }



        alldocs.removeAll(toRemove);
        return alldocs;

    }

    @GetMapping("/description")
    public List<Document> getDescriptionDocuments() {
        return documentRepository.findByArticlenumberContaining("162");
        //return documentRepository.findAll();
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
            switch (type) {
                case "internal" -> document.setDocumenttype(Document.DocumentType.InternalSpecification);
                case "supplier" -> document.setDocumenttype(Document.DocumentType.SupplierSpecification);
                case "wi" -> document.setDocumenttype(Document.DocumentType.WI);
            }
            document.setRevision(revision);
            document.setActive(active);
            document.setAssembly(assembly);
            document.setPpc(ppc);
            Component component = new Component();
            component=componentRepository.findByCompid(article);
            document.setArticlenumber(component);
            //Save the file with the correct name and path
            try {
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
            catch (IOException e) { return ResponseEntity.status(500).body("Failed to save the file"); }
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
