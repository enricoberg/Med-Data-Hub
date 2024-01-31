package com.app.compliance.model;

import jakarta.persistence.*;


@Entity
@Table(name="products")
public class Product {

    public enum SapStatus{
        M1V1,M2V1,M2V2,M3V3,M4V4,NOIT21
    }

    public enum ProductFamily{
        AV,BAGS,EC,AA,ENT,OEM,IU,ACCD,HW,CATH,COMP,PFG,CAL
    }

    public enum SterilizationCycle{
        S1XETO21, S2XETO21, S1XETO22, S22XETO22, GAMMA, BETA, NONE
    }

    public enum SterilizationSite{
        BAI,Sterilverona
    }




    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 20, nullable = false, unique = true)
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

    @Column(length = 40, nullable = false)
    private String supplier;

    @Column(nullable = false)
    private boolean semifinished;


    @Column(length = 10)
    private String dhf;

    @Column(length = 12)
    private String rmf;

    @Column(length = 60)
    private String budi;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private SterilizationCycle sterilizationcycle;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private SterilizationSite sterilizationsite;


    private Integer shelflife;







}
