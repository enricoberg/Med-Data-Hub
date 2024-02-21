package com.app.compliance.model;

import jakarta.persistence.*;

@Entity
@Table(name="configuration_material")
@IdClass(MaterialConfiguration.class)
public class MaterialConfiguration {

    @Id
    @Column(name="configuration_id", nullable = false)

    private Integer confid;

    @Id
    @Column(name="material_id", nullable = false)
    private Integer materialid;

    public Integer getConfid() {
        return confid;
    }

    public void setConfid(Integer confid) {
        this.confid = confid;
    }

    public Integer getMaterialid() {
        return materialid;
    }

    public void setMaterialid(Integer materialid) {
        this.materialid = materialid;
    }
}
