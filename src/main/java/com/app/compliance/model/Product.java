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
        S1XETO21, S2XETO21, S1XETO22, S2XETO22, GAMMA, BETA, NONE
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
    private SapStatus sapstatus;

    @Enumerated(EnumType.STRING)
    private ProductFamily family;

    @ManyToOne
    @JoinColumn(name= "supplierid", referencedColumnName = "id")
    private Supplier supplierid;

    @Column(nullable = false)
    private boolean intercompany;

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


    @Enumerated(EnumType.STRING)
    private SterilizationSite sterilizationsite;


    private Integer shelflife;


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public SapStatus getSapstatus() {
        return sapstatus;
    }

    public void setSapstatus(SapStatus sapstatus) {
        this.sapstatus = sapstatus;
    }

    public ProductFamily getFamily() {
        return family;
    }

    public void setFamily(ProductFamily family) {
        this.family = family;
    }

    public Supplier getSupplierid() {
        return supplierid;
    }

    public void setSupplierid(Supplier supplierid) {
        this.supplierid = supplierid;
    }

    public boolean isIntercompany() {
        return intercompany;
    }

    public boolean isSemifinished() {
        return semifinished;
    }

    public void setSemifinished(boolean semifinished) {
        this.semifinished = semifinished;
    }

    public void setIntercompany(boolean intercompany) {
        this.intercompany = intercompany;
    }

    public String getDhf() {
        return dhf;
    }

    public void setDhf(String dhf) {
        this.dhf = dhf;
    }

    public String getRmf() {
        return rmf;
    }

    public void setRmf(String rmf) {
        this.rmf = rmf;
    }

    public String getBudi() {
        return budi;
    }

    public void setBudi(String budi) {
        this.budi = budi;
    }

    public SterilizationCycle getSterilizationcycle() {
        return sterilizationcycle;
    }

    public void setSterilizationcycle(SterilizationCycle sterilizationcycle) {
        this.sterilizationcycle = sterilizationcycle;
    }

    public SterilizationSite getSterilizationsite() {
        return sterilizationsite;
    }

    public void setSterilizationsite(SterilizationSite sterilizationsite) {
        this.sterilizationsite = sterilizationsite;
    }

    public Integer getShelflife() {
        return shelflife;
    }

    public void setShelflife(Integer shelflife) {
        this.shelflife = shelflife;
    }




}
