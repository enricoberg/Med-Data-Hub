package com.app.compliance.dto;

import lombok.Data;

@Data
public class ChangePasswordLoggedRequest {

    private String id;
    private String current;
    private String password;
    private String repeat;
}
