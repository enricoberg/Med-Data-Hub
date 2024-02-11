package com.app.compliance.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ComponentView {

        private String id;
        private String description;
        private boolean intercompany;
        private String family;
        private String standard;
        private boolean packaging;
        private boolean contact;
        private boolean ca65;
        private boolean baimold;

        public ComponentView(String id, String  description, boolean intercompany, String family, String standard, boolean packaging, boolean contact, boolean ca65, boolean baimold){
            this.id=id;
            this.description=description;
            this.intercompany=intercompany;
            this.family=family;
            this.standard=standard;
            this.packaging=packaging;
            this.contact=contact;
            this.ca65=ca65;
            this.baimold=baimold;
        }



}
