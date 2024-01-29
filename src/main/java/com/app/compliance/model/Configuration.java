package com.app.compliance.model;

import jakarta.persistence.*;

import java.util.Set;


@Entity
@Table(name="configurations")
public class Configuration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name= "suppliernumber", referencedColumnName = "id")
    private Supplier supplier;

    @Column(name="sup_comp_nr", nullable = false, unique = true)
    private String suppliercompnumber;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "component_configuration",
            joinColumns = @JoinColumn(name = "config_id"),
            inverseJoinColumns = @JoinColumn(name = "component_id")
    )
    private Set<Configuration> configs;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "material_configuration",
            joinColumns = @JoinColumn(name = "config_id"),
            inverseJoinColumns = @JoinColumn(name = "material_id")
    )
    private Set<Material> materials;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public String getSuppliercompnumber() {
        return suppliercompnumber;
    }

    public void setSuppliercompnumber(String suppliercompnumber) {
        this.suppliercompnumber = suppliercompnumber;
    }

    public Set<Configuration> getConfigs() {
        return configs;
    }

    public void setConfigs(Set<Configuration> configs) {
        this.configs = configs;
    }

    public Set<Material> getMaterials() {
        return materials;
    }

    public void setMaterials(Set<Material> materials) {
        this.materials = materials;
    }
}
