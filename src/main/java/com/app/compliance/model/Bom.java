package com.app.compliance.model;

import com.app.compliance.repository.ProductRepository;
import jakarta.persistence.*;

@Entity
@Table(name="boms")
public class Bom {


    public enum UnitMeasure{
        CM,KG,M,M2,PAC,PZ
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @ManyToOne
    @JoinColumn(name= "productid", referencedColumnName = "id", nullable = false)
    private Product prodid;


    @ManyToOne
    @JoinColumn(name= "componentid", referencedColumnName = "id", nullable = false)
    private Component compid;

    @Column(nullable = false)
    private float qty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UnitMeasure um;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Product getProdid() {
        return prodid;
    }

    public void setProdid(Product prodid) {
        this.prodid = prodid;
    }

    public Component getCompid() {
        return compid;
    }

    public void setCompid(Component compid) {
        this.compid = compid;
    }

    public float getQty() {
        return qty;
    }

    public void setQty(float qty) {
        this.qty = qty;
    }

    public UnitMeasure getUm() {
        return um;
    }

    public void setUm(UnitMeasure um) {
        this.um = um;
    }


}
