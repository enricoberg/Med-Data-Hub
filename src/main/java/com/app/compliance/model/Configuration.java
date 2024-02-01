package com.app.compliance.model;

import jakarta.persistence.*;

import java.util.Set;


@Entity
@Table(name="configurations")
public class Configuration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @Column(name = "sup_comp_nr", nullable = false, unique = true)
    private String suppliercompnumber;

//    @ManyToOne
//    @JoinColumn(name="comp_id")
//    private Component component;
//
//    @OneToMany(
//            mappedBy = "id",
//            fetch = FetchType.EAGER)
//    private Set<Material> materials;
//
//    @OneToOne(mappedBy = "id")
//    private Supplier supplier;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }


    public String getSuppliercompnumber() {
        return suppliercompnumber;
    }

    public void setSuppliercompnumber(String suppliercompnumber) {
        this.suppliercompnumber = suppliercompnumber;
    }
}




