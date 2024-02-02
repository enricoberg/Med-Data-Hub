package com.app.compliance.dto;


import com.app.compliance.model.Bom;
import com.app.compliance.model.Component;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BomView {

    private String comp_id;
    private String comp_description;
    private float qty;
    private Bom.UnitMeasure um;

    public BomView(String comp_id, String comp_description, float qty, Bom.UnitMeasure um) {
        this.comp_id = comp_id;
        this.comp_description = comp_description;
        this.qty = qty;
        this.um = um;
    }



}
