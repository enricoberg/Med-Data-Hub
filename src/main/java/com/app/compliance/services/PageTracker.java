package com.app.compliance.services;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

class PageTracker extends PdfPageEventHelper {
    private int currentPage = 1;

    public int getCurrentPage() {
        return currentPage;
    }

    @Override
    public void onStartPage(PdfWriter writer, Document document) {
        currentPage = writer.getPageNumber();
    }
}