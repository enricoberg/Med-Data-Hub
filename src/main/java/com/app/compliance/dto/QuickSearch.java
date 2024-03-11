package com.app.compliance.dto;

import com.app.compliance.model.Bom;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class QuickSearch {

    private String article;
    private String type;
    private String field;



    public QuickSearch(String article, String type, String field){
        this.article=article;
        this.type = type;
        this.field = field;
    }
}
