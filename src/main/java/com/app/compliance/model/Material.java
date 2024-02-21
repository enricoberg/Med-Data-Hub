package com.app.compliance.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;

import java.util.List;
import java.util.Set;

@Entity
@Table(name="materials")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Material {





    public enum MaterialFamily{
        ABS,STEEL,ACRYLIC,ADHESIVE,ADHESIVETAPE,ALUMINIUM,CARDBOARD,ADHESIVEPAPER,MEDICALPAPER,COLORANT,TPE,ETPU,FILM,HDPE,COATING,HIPS,INK,MABS,MASTERBATCH,MEMBRANE,PA,PC,LDPE,PES,PET,PETG,PMMA,PP,PPE,PRIMER,PS,PSU,PTFE,PU,PUR,PVC,PVCDEHPFREE,SAN,SEBS,SILICONE,SOLVENT,TYVEK,VARIOUS
    }



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @Column(
            length = 40,
            nullable = false,
            unique = true
    )
    private String brandname;

    @Enumerated(EnumType.STRING)
    private MaterialFamily family;

    @Column(length = 20)
    private String plasticizer;

    @Column(length = 40)
    private String supplier;


//    @ManyToMany(mappedBy = "materials",
//            fetch = FetchType.EAGER)
//    @JsonBackReference
//    private List<Configuration> configurations;


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getBrandname() {
        return brandname;
    }

    public void setBrandname(String brandname) {
        this.brandname = brandname;
    }

    public MaterialFamily getFamily() {
        return family;
    }

    public void setFamily(MaterialFamily family) {
        this.family = family;
    }

    public String getPlasticizer() {
        return plasticizer;
    }

    public void setPlasticizer(String plasticizer) {
        this.plasticizer = plasticizer;
    }

    public String getSupplier() {
        return supplier;
    }

    public void setSupplier(String supplier) {
        this.supplier = supplier;
    }
}
