package com.app.compliance.services;
import java.io.IOException;
import java.net.URL;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;


class HeaderFooterPageEvent extends PdfPageEventHelper {

    private Font headerFooterFont = new Font(Font.FontFamily.HELVETICA, 10, Font.ITALIC);
    private String header;

    HeaderFooterPageEvent(String header){
        this.header=header;
    }
    @Override
    public void onEndPage(PdfWriter writer, Document document) {
        PdfContentByte canvas = writer.getDirectContent();
        
        try {
            // Load the image from resources. Make sure this path is correct.
            URL resource = ReportService.class.getClassLoader().getResource("static/css/report_header.png");
            if (resource != null) {
                Image headerImage = Image.getInstance(resource);

                // Adjust the image position and size
                headerImage.scalePercent(23f,23f); //scale in percentage
                
                float xPos =  document.leftMargin();
                float yPos = document.top() + 5;
                headerImage.setAbsolutePosition(xPos, yPos);

                // Add the image to the canvas
                canvas.addImage(headerImage);
            } else {
                System.err.println("Image resource not found!");
            }
        } catch (BadElementException | IOException e) {
            e.printStackTrace();
        } catch (DocumentException e) {
            e.printStackTrace();
        }

       

       


        
        // ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER,
        //         new Phrase("", headerFooterFont),
        //         (document.right() - document.left()) / 2 + document.leftMargin(),
        //         document.top() + 10, 0);

        ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER,
                new Phrase(header + " - Page " + writer.getPageNumber(), headerFooterFont),
                (document.right() - document.left()) / 2 + document.leftMargin(),
                document.bottom() - 10, 0);
    }

    
}