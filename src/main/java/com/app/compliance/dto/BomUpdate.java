package com.app.compliance.dto;

import lombok.Data;

@Data
public class BomUpdate {
    private String article;
    private float qty;
    private String um;
    private boolean assembly;
}
