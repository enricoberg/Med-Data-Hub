package com.app.compliance.controller;


import com.app.compliance.dto.DocumentView;
import com.app.compliance.model.Component;
import com.app.compliance.repository.ComponentRepository;
import com.app.compliance.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/download")
@RequiredArgsConstructor
public class DownloadController {


    @Autowired
    private final DocumentRepository documentRepository;
    private static final String EXTENSION = ".pdf";

    private static final String SERVER_LOCATION = "C:/Program Files/MedDataHub/documentfolder";

    @GetMapping("/")
    public ResponseEntity<ByteArrayResource> download(
            @RequestParam("filename") String filename) throws IOException {
        File file = new File(SERVER_LOCATION + File.separator + filename + EXTENSION);

        if (!file.exists()) throw new IOException("Document not found");

        HttpHeaders header = new HttpHeaders();
        header.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=" + filename + EXTENSION);
        header.add("Cache-Control", "no-cache, no-store, must-revalidate");
        header.add("Pragma", "no-cache");
        header.add("Expires", "0");

        Path path = Paths.get(file.getAbsolutePath());
        ByteArrayResource resource = new ByteArrayResource(Files.readAllBytes(path));

        return ResponseEntity.ok()
                .headers(header)
                .contentLength(file.length())
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }





    @GetMapping("/activespec")
    public ResponseEntity<ByteArrayResource> downloadActive(
            @RequestParam("article") String article) throws IOException {


        //ELIMINATE ALL THE RECORDS THAT DO NOT MATCH WITH THE PARAMETERS REQUESTED
        List<DocumentView> toRemove = new ArrayList<>();
        List<Object[]> resultobjects = documentRepository.getDocumentViews();
        List<DocumentView> alldocs = getDocumentViews((resultobjects));
        for (DocumentView doc : alldocs) {
            if(!doc.isActive()) toRemove.add(doc);
            if(!doc.getId().equals(article)) toRemove.add(doc);
            if (!doc.getDocumentType().equals("InternalSpecification")) toRemove.add(doc);
        }
        alldocs.removeAll(toRemove);
        if(alldocs.size()!=1) throw new IOException("Impossible to find a single file matching") ;

        String filename=article+"_"+alldocs.get(0).getRevision()+"_INTERNALSPECIFICATION";



        File file = new File(SERVER_LOCATION + File.separator + filename + EXTENSION);

        if (!file.exists()) throw new IOException("Document not found");

        HttpHeaders header = new HttpHeaders();
        header.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=" + filename + EXTENSION);
        header.add("Cache-Control", "no-cache, no-store, must-revalidate");
        header.add("Pragma", "no-cache");
        header.add("Expires", "0");

        Path path = Paths.get(file.getAbsolutePath());
        ByteArrayResource resource = new ByteArrayResource(Files.readAllBytes(path));

        return ResponseEntity.ok()
                .headers(header)
                .contentLength(file.length())
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
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
