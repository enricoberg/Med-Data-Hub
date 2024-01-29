package com.app.compliance.model;

import jakarta.persistence.*;

@Entity
@Table(name="suppliers")
public class Supplier {

    @Id
    @Column(
            length = 20,
            nullable = false,
            unique = true
    )
    private String sap_code;

    @Column(
            length = 40,
            nullable = false,
            unique = true
    )
    private String supplier_name;

    @Column(length = 50)
    private String contact1;

    @Column(length = 50)
    private String contact2;


}
