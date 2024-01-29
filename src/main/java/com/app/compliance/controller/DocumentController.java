package com.app.compliance.controller;

import com.app.compliance.dto.DocumentView;
import com.app.compliance.model.Document;
import com.app.compliance.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.Option;
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
