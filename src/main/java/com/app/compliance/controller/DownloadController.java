package com.app.compliance.controller;


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

import com.app.compliance.model.Document;
import com.app.compliance.repository.DocumentRepository;

import lombok.RequiredArgsConstructor;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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

            List<Object[]> activedoc=documentRepository.getActiveSpec(article);
            String revision="";
            for (Object[] result : activedoc) {
                revision = getStringValue(result[2]);
            }

        String filename= article + "_" + revision +"_INTERNALSPECIFICATION";

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



    private String getStringValue(Object value) {
        return (value != null) ? value.toString() : null;
    }
}
