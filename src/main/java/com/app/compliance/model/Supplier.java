package com.app.compliance.model;

import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name="suppliers")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


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

    @Column(length = 255)
    private String contact;


    @OneToMany(
            mappedBy = "supplier",
            fetch = FetchType.EAGER)
    private Set<Configuration> configurations;

//    @OneToOne(mappedBy = "supplier")
//    private Configuration configuration;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getSap_code() {
        return sap_code;
    }

    public void setSap_code(String sap_code) {
        this.sap_code = sap_code;
    }

    public String getSupplier_name() {
        return supplier_name;
    }

    public void setSupplier_name(String supplier_name) {
        this.supplier_name = supplier_name;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }


    public Set<Configuration> getConfigurations() {
        return configurations;
    }

    public void setConfigurations(Set<Configuration> configurations) {
        this.configurations = configurations;
    }
}
