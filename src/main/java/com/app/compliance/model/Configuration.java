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


    @Column(name = "sup_comp_nr", nullable = false, unique = true)
    private String suppliercompnumber;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "configuration_material",
            joinColumns = @JoinColumn(name = "configuration_id"),
            inverseJoinColumns = @JoinColumn(name = "material_id")
    )
    @JsonManagedReference
    private Set<Material> materials;

    @ManyToOne
    @JoinColumn(name="component_id")
    @JsonBackReference
    private Component component;

    @ManyToOne
    @JoinColumn(name="supplier_id")
    @JsonManagedReference
    private Supplier supplier;


//    @OneToOne
//    @JoinColumn(
//            name = "supplier_id",
//            referencedColumnName = "id")
//    private Supplier supplier;



    public void addMaterialById(MaterialRepository materialRepository, Integer materialId) {
        Optional<Material> materialOptional = materialRepository.findById(materialId);
        materialOptional.ifPresent(material -> {
            this.getMaterials().add(material);
            material.getConfigurations().add(this);
            materialRepository.save(material);
        });
    }




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




