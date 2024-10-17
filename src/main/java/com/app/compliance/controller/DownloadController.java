package com.app.compliance.controller;



import org.attoparser.dom.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamResource;
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
import com.app.compliance.repository.DocumentRepository;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Font;
import com.itextpdf.text.Image;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/download")
@RequiredArgsConstructor
public class DownloadController {

    @Autowired
    private final DocumentRepository documentRepository;

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





    @GetMapping("/activespec")
    public ResponseEntity<ByteArrayResource> downloadActive(
            @RequestParam("article") String article) throws IOException {

            

        Document document = documentRepository.findByArticlecodeAndActiveAndDocumenttype(article, true, Document.DocumentType.InternalSpecification);
        if(document==null) throw new IOException("Document not found");
        String revision=document.getRevision();
        String filename= article + "_" + revision +"_INTERNALSPECIFICATION";
            System.out.println(filename);
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

    @GetMapping("/customlog")
        public ResponseEntity<InputStreamResource> downloadPDFFile(HttpServletResponse response) throws DocumentException {
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();         
            com.itextpdf.text.Document document = new com.itextpdf.text.Document();            
            PdfWriter.getInstance(document, byteArrayOutputStream);
            document.open();
            
            // CREATE THE CONTENT OF THE PDF FILE.            
            // Adding Title
            Font titleFont = new Font(Font.FontFamily.TIMES_ROMAN, 18, Font.BOLD);
            Paragraph title = new Paragraph("The Document Title", titleFont);
            title.setAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
            document.add(title);

            // Adding a Paragraph
            document.add(new Paragraph("Hello World! This is a paragraph."));

            // Adding an Image
            try{
            String imageUrl = "https://www.smartworld.it/wp-content/uploads/mobile/2021/05/google-logo-final-3-800x450.jpg";            
            Image image = Image.getInstance(new URL(imageUrl));
            //image.scaleAbsolute(120f, 100f);//scale to pixel number
            image.scalePercent(50f,50f); //scale in percentage
            // image.setScaleToFitHeight(true);
            image.setAlignment(Image.ALIGN_CENTER);
            document.add(image);
            }
            catch(Exception e){
                e.printStackTrace();
            }

            // Adding a Table
            PdfPTable table = new PdfPTable(3); // 3 columns
            table.addCell("Cell 1");
            table.addCell("Cell 2");
            table.addCell("Cell 3");
            document.add(table);
            
            // --------------------------------------------
            document.close();          
            response.setContentType("application/pdf");
            String filename;
            LocalDateTime now = LocalDateTime.now();
            filename = "attachment; filename=MDHLog_"+now.toString()+".pdf";
            response.setHeader("Content-Disposition", filename);            
            ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(byteArrayOutputStream.toByteArray());
            
            return ResponseEntity
                    .ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(new InputStreamResource(byteArrayInputStream));
        }


        
}
