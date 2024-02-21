package com.app.compliance.model;

import jakarta.persistence.*;

@Entity
@Table(name="documents")
public class Document {


    public String getArticlecode() {
        return articlecode;
    }

    public void setArticlecode(String articlecode) {
        this.articlecode = articlecode;
    }

    public enum DocumentType {
        InternalSpecification, SupplierSpecification, WI
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;



    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name="document_type")
    private DocumentType documenttype;



    @Column(
            length = 10,
            nullable = false
    )
    private String revision;

    @Column(nullable = false)
    private boolean active;

    @Column(nullable = false)
    private boolean assembly;

    @Column(length = 10)
    private String ppc;

//    @ManyToOne
//    @JoinColumn(name= "article_number", referencedColumnName = "id")
//    private Component articlenumber;

    @Column(nullable = false)
    private String articlecode;



    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }



    public DocumentType getDocumenttype() {
        return documenttype;
    }

    public void setDocumenttype(DocumentType documenttype) {
        this.documenttype = documenttype;
    }




    public String getRevision() {
        return revision;
    }

    public void setRevision(String revision) {
        this.revision = revision;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getPpc() {
        return ppc;
    }

    public void setPpc(String ppc) {
        this.ppc = ppc;
    }

    public boolean isAssembly() {
        return assembly;
    }

    public void setAssembly(boolean assembly) {
        this.assembly = assembly;
    }

//    public Component getArticlenumber() {
//        return articlenumber;
//    }
//
//    public void setArticlenumber(Component articlenumber) {
//        this.articlenumber = articlenumber;
//    }

}
