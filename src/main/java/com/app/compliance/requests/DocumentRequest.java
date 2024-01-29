package com.app.compliance.requests;

public class DocumentRequest {

    private String description;
    private String article;
    private String revision;
    private Boolean active;
    private Boolean wi;
    private Boolean intspec;
    private Boolean supplierspec;

    public String getDescription() {
        return description;
    }

    public String getArticle() {
        return article;
    }

    public String getRevision() {
        return revision;
    }

    public Boolean getActive() {
        return active;
    }

    public Boolean getWi() {
        return wi;
    }

    public Boolean getIntspec() {
        return intspec;
    }

    public Boolean getSupplierspec() {
        return supplierspec;
    }
}
