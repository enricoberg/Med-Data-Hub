package com.app.compliance.dto;

import com.app.compliance.model.Document.DocumentType;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class DocumentView {


        private String id;
        private String description;
        private String revision;
        private String documentType;
        private String ppc;
        private boolean active;
        private String docid;



        public DocumentView(String id, String description, String revision, String documentType, String ppc, boolean active, String docid) {
                this.id = id;
                this.description = description;
                this.revision = revision;
                this.documentType = documentType;
                this.ppc = ppc;
                this.active=active;
                this.docid=docid;
        }
        public DocumentView(String id, String description, String revision, DocumentType documentType, String ppc, boolean active, Integer docid) {
                this.id = id;
                this.description = description;
                this.revision = revision;
                this.documentType = documentType.toString();
                this.ppc = ppc;
                this.active=active;
                this.docid=String.valueOf(docid);
        }
}
