package com.app.compliance.model;

import jakarta.persistence.*;


@Entity
@Table(name="products")
public class Product {

    public enum SapStatus{
        M1V1,M2V1,M2V2,M3V3,M4V4,NOIT21
    }

    public enum ProductFamily{
        AVSYSTEMS,ACUTE,CATHETERS,CONCENTRATES,CONTINENCE,CONTAINERS,ENTERAL,IRRIGATION,OEM,OSTOMY,PFG,TPN,WOUND
    }


    @Id
    @Column(length = 20)
    private String code;


    @Column(
            length = 60,
            nullable = false
    )
    private String description;

    @Enumerated(EnumType.STRING)
    private SapStatus sap_status;

    @Enumerated(EnumType.STRING)
    private ProductFamily family;

    @Column(length = 10)
    private String dhf;

    @Column(length = 12)
    private String rmf;

    @Column(length = 60)
    private String budi;

    @Column(length = 3000)
    private String bom;






}
