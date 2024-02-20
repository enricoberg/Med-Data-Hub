package com.app.compliance.dto;

public class BomRequest {

    private String um;
    private float qty;
    private Integer compid;

    private boolean assembly;
    private Integer prodid;


    public String getUm() {
        return um;
    }

    public void setUm(String um) {
        this.um = um;
    }

    public float getQty() {
        return qty;
    }

    public void setQty(float qty) {
        this.qty = qty;
    }

    public Integer getCompid() {
        return compid;
    }

    public void setCompid(Integer compid) {
        this.compid = compid;
    }

    public Integer getProdid() {
        return prodid;
    }

    public void setProdid(Integer prodid) {
        this.prodid = prodid;
    }

    public boolean isAssembly() {
        return assembly;
    }

    public void setAssembly(boolean assembly) {
        this.assembly = assembly;
    }
}
