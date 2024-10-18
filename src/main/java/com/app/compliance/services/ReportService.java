package com.app.compliance.services;

import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

import java.net.URL;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.io.ByteArrayInputStream;
import java.util.List;
import java.io.File;
import java.io.IOException;

@Service
public class ReportService {

    @Autowired
    private  JWTService jwtService;

    public  ByteArrayInputStream downloadPDFFile(HttpServletRequest request,String reportTitle, List<Object[]> objs) throws DocumentException {

            
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();         
            com.itextpdf.text.Document document = new com.itextpdf.text.Document(PageSize.A4, 36, 36, 170, 50);            
            PdfWriter writer =PdfWriter.getInstance(document, byteArrayOutputStream);

            // Instantiate and set the custom page event handler
            PageTracker pageTracker = new PageTracker();
            writer.setPageEvent(pageTracker);


            
            // EXTRACT THE USER INFO
            String authorizationHeader = request.getHeader("Authorization");            
            String email="";
            LocalDateTime now = LocalDateTime.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            String formattedDate = now.format(formatter);
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) email = jwtService.extractUserName(authorizationHeader.substring(7));   
            String headerdetails = "Automatic Report generated at "+formattedDate+" by user "+email;
            // CREATE THE CONTENT OF THE PDF FILE.           
            
            // Set the header and footer event
            HeaderFooterPageEvent event = new HeaderFooterPageEvent(headerdetails);
            writer.setPageEvent(event);


            document.open();
            // Adding an Image
            try{
            String imageUrl = ReportService.class.getClassLoader().getResource("static/css/report_header.png").toString();                    
            Image image = Image.getInstance(new URL(imageUrl));            
            //image.scaleAbsolute(120f, 100f);//scale to pixel number
            image.scalePercent(23f,23f); //scale in percentage
            // image.setScaleToFitHeight(true);
            image.setAlignment(Image.ALIGN_CENTER);
            // document.add(image);
            // Adding Title
            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
            Paragraph title = new Paragraph(reportTitle, titleFont);
            title.setAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
            document.add(title);
            Integer curr_page=1;
            // Adding a Paragraph
            
            document.add(new Paragraph(headerdetails));
            document.add(new Paragraph(" "));
            // Adding a Table
            PdfPTable table = generateLogTable(objs);
            document.add(table);
            document.add(new Paragraph(" "));
            document.add(new Paragraph("END OF DOCUMENT "));
            }
            
            catch(Exception e){
                e.printStackTrace();
            }

            
            
            // --------------------------------------------
            document.close();          
                        
            ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(byteArrayOutputStream.toByteArray());
            
            return byteArrayInputStream;
        }
    

        public PdfPTable generateLogTable(List<Object[]> objs) {
            PdfPTable table = new PdfPTable(4); // 4 columns
            table.setWidthPercentage(100);
            // table.setWidths(new float[]{300, 350, 150,600 });
            float[] columnWidths = {1f, 1.8f, 1f, 3f};
            try {
                table.setWidths(columnWidths);
            } catch (DocumentException e) {e.printStackTrace();}
            Font customFont = FontFactory.getFont(FontFactory.HELVETICA, 8, Font.NORMAL);
            table.addCell("Time");
            table.addCell("Username");
            table.addCell("Role");
            table.addCell("Action");
            for (Object[] row : objs) {
                customAddCell(table, row[0].toString().substring(0,16).replace("T"," "), customFont); // Format the date as YYYY-MM-DD HH:MM
                customAddCell(table, row[1].toString(), customFont);
                customAddCell(table, row[2].toString().toLowerCase(), customFont);
                customAddCell(table, row[3].toString(), customFont);
                
                
            }
            return table;
        }

        private void customAddCell(PdfPTable table, String content, Font font) {
            PdfPCell cell = new PdfPCell(new Phrase(content, font));
            table.addCell(cell);
        }
}
