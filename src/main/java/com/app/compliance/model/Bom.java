package com.app.compliance.model;

import com.app.compliance.repository.ProductRepository;
import jakarta.persistence.*;

@Entity
@Table(name="boms")
public class Bom {


    public boolean isAssembly() {
        return assembly;
    }

    public void setAssembly(boolean assembly) {
        this.assembly = assembly;
    }

    public enum UnitMeasure{
        CM,KG,M,M2,PAC,PZ,L
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @ManyToOne
    @JoinColumn(name= "productid", referencedColumnName = "id", nullable = false)
    private Product prodid;


//    @ManyToOne
//    @JoinColumn(name= "componentid", referencedColumnName = "id", nullable = false)
//    private Component compid;


    private boolean assembly;

    @Column(nullable = false, name="componentid")
    private Integer compid;

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


    public Integer getCompid() {
        return compid;
    }

    public void setCompid(Integer compid) {
        this.compid = compid;
    }
}
