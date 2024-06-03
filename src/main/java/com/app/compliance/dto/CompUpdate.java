package com.app.compliance.dto;

import lombok.Data;

@Data
public class CompUpdate {
    
    private String article;
    private String description;
    private boolean intercompany;
    private boolean packaging;
    private boolean contact;
    private boolean ca65;    
    private String family;
    private String standard;

}



