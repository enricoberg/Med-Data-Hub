package com.app.compliance.dto;

public class ConfRequest {

    private String supcompcode;

    private Integer compid;
    private Integer matid;
    private Integer supid;


    public Integer getSupid() {
        return supid;
    }

    public void setSupid(Integer supid) {
        this.supid = supid;
    }

    public Integer getMatid() {
        return matid;
    }

    public void setMatid(Integer matid) {
        this.matid = matid;
    }

    public Integer getCompid() {
        return compid;
    }

    public void setCompid(Integer compid) {
        this.compid = compid;
    }

    public String getSupcompcode() {
        return supcompcode;
    }

    public void setSupcompcode(String supcompcode) {
        this.supcompcode = supcompcode;
    }
}
