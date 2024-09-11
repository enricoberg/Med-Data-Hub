package com.app.compliance.model;

import com.app.compliance.repository.MaterialRepository;
import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;

import java.util.Optional;
import java.util.Set;


@Entity
@Table(name="configurations")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Configuration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @Column(name = "sup_comp_nr", nullable = false, unique = false)
    private String suppliercompnumber;

//    @ManyToMany(fetch = FetchType.EAGER)
//    @JoinTable(
//            name = "configuration_material",
//            joinColumns = @JoinColumn(name = "configuration_id"),
//            inverseJoinColumns = @JoinColumn(name = "material_id")
//    )
//    private Set<Material> materials;

//    @ManyToOne
//    @JoinColumn(name="component_id")
//    @JsonBackReference
//    private Component component;

    @Column(name="component_id")
    private Integer compid;

    @ManyToOne
    @JoinColumn(name="supplier_id")
    @JsonManagedReference
    private Supplier supplier;






//    public void addMaterialById(MaterialRepository materialRepository, Integer materialId) {
//        Optional<Material> materialOptional = materialRepository.findById(materialId);
//        materialOptional.ifPresent(material -> {
//            this.getMaterials().add(material);
//            material.getConfigurations().add(this);
//            materialRepository.save(material);
//        });
//    }




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





    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public Integer getCompid() {
        return compid;
    }

    public void setCompid(Integer compid) {
        this.compid = compid;
    }

//    public Component getComponent() {
//        return component;
//    }
//
//    public void setComponent(Component component) {
//        this.component = component;
//    }
}




