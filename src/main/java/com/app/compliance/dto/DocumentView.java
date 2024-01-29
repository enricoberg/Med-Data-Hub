package com.app.compliance.dto;

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



        public DocumentView(String id, String description, String revision, String documentType, String ppc, boolean active) {
                this.id = id;
                this.description = description;
                this.revision = revision;
                this.documentType = documentType;
                this.ppc = ppc;
                this.active=active;
        }
}
