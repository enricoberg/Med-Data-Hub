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
        ABS,ADDITIVE,ADHESIVEPAPER,ADHESIVETAPE,ADHESIVE,ALUMINUM,BRASS,CARTONBOX,CIIR,COLORANT,CONCENTRATES,COP,EVA,HDPE,HIPS,INK,IR,LDPE,MABS,MEDICALPAPER,MULTIMATERIAL,NA,NITINOL,PA,PAPE,PAPER,PC,PCABS,PE,PEEVA,PES,PET,PETPE,PETPP,PMMA,PO,POM,PP,PPPE,PPC,PPE,PPH,PS,PSU,PTFE,PUR,PVC,PVP,SAN,SBC,SEBS,SI,SOLVENT,SST,SULFATE,TPE,TPU,TUNGSTEN
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

    @Column(length = 40)
    private String notes;


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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
