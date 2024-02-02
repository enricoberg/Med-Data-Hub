package com.app.compliance.model;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;

import java.util.Set;


@Entity
@Table(name="configurations")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Configuration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @Column(name = "sup_comp_nr", nullable = false, unique = true)
    private String suppliercompnumber;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "configuration_material",
            joinColumns = @JoinColumn(name = "material_id"),
            inverseJoinColumns = @JoinColumn(name = "configuration_id")
    )
    private Set<Material> materials;

    @ManyToOne
    @JoinColumn(name="component_id")
    private Component component;

    @ManyToOne
    @JoinColumn(name="supplier_id")
    private Supplier supplier;


//    @OneToOne
//    @JoinColumn(
//            name = "supplier_id",
//            referencedColumnName = "id")
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

    public Set<Material> getMaterials() {
        return materials;
    }

    public void setMaterials(Set<Material> materials) {
        this.materials = materials;
    }



    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public Component getComponent() {
        return component;
    }

    public void setComponent(Component component) {
        this.component = component;
    }
}




