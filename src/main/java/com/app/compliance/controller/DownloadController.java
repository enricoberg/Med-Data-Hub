package com.app.compliance.controller;



import org.attoparser.dom.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.compliance.dto.DocumentView;
import com.app.compliance.model.Document;
import com.app.compliance.model.LogInfo;
import com.app.compliance.repository.DocumentRepository;
import com.app.compliance.repository.LogRepository;
import com.app.compliance.services.JWTService;
import com.app.compliance.services.ReportService;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Font;
import com.itextpdf.text.Image;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/download")
@RequiredArgsConstructor
public class DownloadController {

    @Autowired
    private final DocumentRepository documentRepository;

    @Autowired
    private final LogRepository logRepository;
    

    @Autowired
    private ReportService reportService;

    private static final String EXTENSION = ".pdf";
    private final  String SERVER_LOCATION = System.getProperty("user.dir") + File.separator + "documentfolder";    
    // private static final String SERVER_LOCATION = "C:/Program Files/MedDataHub/documentfolder";

    @GetMapping("/")
    public ResponseEntity<ByteArrayResource> download(
            @RequestParam("filename") String filename) throws IOException {
        File file = new File(SERVER_LOCATION + File.separator + filename + EXTENSION);

        if (!file.exists()) throw new IOException("Document not found");

        HttpHeaders header = new HttpHeaders();
        // header.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=" + filename + EXTENSION);
        header.add("Cache-Control", "no-cache, no-store, must-revalidate");
        header.add("Pragma", "no-cache");
        header.add("Expires", "0");
        header.add("Content-Disposition","attachment; filename=spec.pdf");
        
        Path path = Paths.get(file.getAbsolutePath());
        ByteArrayResource resource = new ByteArrayResource(Files.readAllBytes(path));

        return ResponseEntity.ok()
                .headers(header)
                .contentLength(file.length())
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }





    // @GetMapping("/activespec")
    // public ResponseEntity<ByteArrayResource> downloadActive(
    //         @RequestParam("article") String article) throws IOException {

            

    //     Document document = documentRepository.findByArticlecodeAndActiveAndDocumenttype(article, true, Document.DocumentType.InternalSpecification);
    //     if(document==null) throw new IOException("Document not found");
    //     String revision=document.getRevision();
    //     String filename= article + "_" + revision +"_INTERNALSPECIFICATION";
    //         System.out.println(filename);
    //     File file = new File(SERVER_LOCATION + File.separator + filename + EXTENSION);

    //     if (!file.exists()) throw new IOException("Document not found");

    //     HttpHeaders header = new HttpHeaders();
    //     header.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=" + filename + EXTENSION);
    //     header.add("Cache-Control", "no-cache, no-store, must-revalidate");
    //     header.add("Pragma", "no-cache");
    //     header.add("Expires", "0");

    //     Path path = Paths.get(file.getAbsolutePath());
    //     ByteArrayResource resource = new ByteArrayResource(Files.readAllBytes(path));

    //     return ResponseEntity.ok()
    //             .headers(header)
    //             .contentLength(file.length())
    //             .contentType(MediaType.APPLICATION_PDF)
    //             .body(resource);
    // }

    @GetMapping("/customlog")
        public ResponseEntity<InputStreamResource> downloadLog(HttpServletResponse response,HttpServletRequest request, 
        @RequestParam("startdate") String startdate,
        @RequestParam("enddate") String enddate
        ) throws DocumentException {
                   
            // DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            // LocalDate  datestart = LocalDate.parse(startdate, formatter);
            // LocalDate  dateend = LocalDate.parse(enddate, formatter);
            // LocalDateTime mindateTime = LocalDateTime.of(datestart, LocalTime.MIN);
            // LocalDateTime maxdateTime = LocalDateTime.of(dateend, LocalTime.MAX);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
            LocalDateTime mindateTime = LocalDateTime.parse(startdate, formatter);
            LocalDateTime maxdateTime = LocalDateTime.parse(enddate, formatter);


            List<LogInfo> alllogs = logRepository.findByTimeBetween(mindateTime, maxdateTime);
            List<Object[]> genericdata = new ArrayList<>();
            genericdata = alllogs.stream()
            .map(log -> new Object[]{log.getTime(), log.getUsername(), log.getRole(), log.getAction()})
            .collect(Collectors.toList());
            
            
            response.setContentType("application/pdf");
            String filename;
            LocalDateTime now = LocalDateTime.now();
            filename = "attachment; filename=MDHLog_"+now.toString()+".pdf";
            response.setHeader("Content-Disposition", filename);            
            ByteArrayInputStream byteArrayInputStream = reportService.downloadPDFFile(request, "Audit Trail Report",genericdata);
            return ResponseEntity
                    .ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(new InputStreamResource(byteArrayInputStream));
        }


    @GetMapping("/activespec")
    public ResponseEntity<Resource> downloadActive(HttpServletResponse response,@RequestParam("article") String article) throws IOException {
        // Assuming you have a File object representing the file you want to download
        Document document = documentRepository.findByArticlecodeAndActiveAndDocumenttype(article, true, Document.DocumentType.InternalSpecification);
        if(document==null) throw new IOException("Document not found");
        String revision=document.getRevision();
        String filename= article + "_" + revision +"_INTERNALSPECIFICATION";
            System.out.println(filename);
        File file = new File(SERVER_LOCATION + File.separator + filename + EXTENSION);

        if (!file.exists()) throw new IOException("Document not found");       
        
        
        // Set response headers
        response.setContentType("application/pdf");
        
        // Set Content-Disposition header to prompt download
        String headerValue = "attachment; filename=" + file.getName();
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, headerValue);
        
        // Create a Resource from the file
        FileSystemResource resource = new FileSystemResource(file);
        
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }

        
}
