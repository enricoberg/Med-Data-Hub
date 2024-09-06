package com.app.compliance.model;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name="components")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Component {




    public enum ComponentFamily {
        FILMS,IFU,TRANSDUCERS,MATERIALS,CAPS,CONNECTORS,CONICALCONNECTORS,INJECTIONPOINTS,FILTERS,CLAMPS,SPIKES,CHAMBERS,COVERS,TUBES,VARIOUS,BAGS,CARTONS,POUCHES,ADJUVANTS,LABELS,SFTUBE,SFVARIOUS, ELECTRODES, HOTSTAMPING
    }
    public enum ConicalStandard {
        ENFIT, LUERLOCK, TPNLOCK
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(
            length = 20,
            nullable = false,
            name="comp_id"
    )
    private String compid;



    @Column(
            length = 60,
            nullable = false
    )
    private String description;

    @Column(nullable = false)
    private boolean intercompany;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComponentFamily family;

    @Enumerated(EnumType.STRING)
    private ConicalStandard standard;

    @Column(nullable = true)
    private boolean packagingmaterial;

    @Column(nullable = false)
    private boolean contact;

    @Column(name = "CA65", nullable = false)
    private boolean ca65;


    @Column(nullable = false)
    private boolean baimold;

//    @OneToMany(
//            mappedBy = "component",
//            fetch = FetchType.EAGER)
//    @JsonManagedReference
//    private Set<Configuration> configurations;





    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getComp_id() {
        return compid;
    }

    public void setComp_id(String comp_id) {
        this.compid = comp_id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isIntercompany() {
        return intercompany;
    }

    public void setIntercompany(boolean intercompany) {
        this.intercompany = intercompany;
    }

    public ComponentFamily getFamily() {
        return family;
    }

    public void setFamily(ComponentFamily family) {
        this.family = family;
    }

    public ConicalStandard getStandard() {
        return standard;
    }

    public void setStandard(ConicalStandard standard) {
        this.standard = standard;
    }

    public boolean isPackagingmaterial() {
        return packagingmaterial;
    }

    public void setPackagingmaterial(boolean packagingmaterial) {
        this.packagingmaterial = packagingmaterial;
    }

    public boolean isContact() {
        return contact;
    }

    public void setContact(boolean contact) {
        this.contact = contact;
    }

    public boolean isCa65() {
        return ca65;
    }

    public void setCa65(boolean ca65) {
        this.ca65 = ca65;
    }

    public boolean isBaimold() {
        return baimold;
    }

    public void setBaimold(boolean baimold) {
        this.baimold = baimold;
    }

//    public Set<Configuration> getConfigurations() {
//        return configurations;
//    }
//
//    public void setConfigurations(Set<Configuration> configurations) {
//        this.configurations = configurations;
//    }

}
