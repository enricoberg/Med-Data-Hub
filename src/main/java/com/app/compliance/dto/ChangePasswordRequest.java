package com.app.compliance.dto;

import lombok.Data;

@Data
public class ChangePasswordRequest {

    private String id;
    private String security;
    private String password;
    private String repeat;
}
