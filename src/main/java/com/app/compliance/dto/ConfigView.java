package com.app.compliance.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ConfigView {


    private String supplier;
    private String suppliercode;
    private String brandname;
    private String family;
    private String materialsupplier;


    public ConfigView(String supplier, String suppliercode, String brandname, String family, String materialsupplier) {
        this.supplier = supplier;
        this.suppliercode = suppliercode;
        this.brandname = brandname;
        this.family = family;
        this.materialsupplier = materialsupplier;
    }
}
