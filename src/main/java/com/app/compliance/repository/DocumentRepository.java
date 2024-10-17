package com.app.compliance.repository;
import com.app.compliance.dto.DocumentView;
import com.app.compliance.model.Component;
import com.app.compliance.model.Document;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface DocumentRepository extends JpaRepository<Document, Integer> {

//    List<Document> findByArticlenumberContaining(String searchString);
//    List<Document> findByRevisionContainingAndArticlenumberContaining(String revision, String articlenumber);

    Document findByArticlecodeAndActiveAndDocumenttype(String article, boolean active, Document.DocumentType documenttype);

    Optional<Document> findByArticlecodeAndRevisionAndDocumenttype(String article, String revision, Document.DocumentType documenttype);
    
    List<Document> findByArticlecodeAndDocumenttype(String article, Document.DocumentType documenttype);

    List<Document> findAll();

    

    //EXAMPLE OF USAGE
    
    // @Query("SELECT d.id, d.articlecode " +
    //     "FROM Document d  " +
    //     "WHERE d.assembly = TRUE")
    // List<Object[]> findDocumentsORM();

    @Query("SELECT new com.app.compliance.dto.DocumentView(d.articlecode,  c.description, d.revision, d.documenttype, d.ppc, d.active, d.id) " +
        "FROM Document d  LEFT JOIN Component c " +
        "ON d.articlecode = c.compid "+
        "WHERE d.assembly = FALSE")
    List<DocumentView> findDocumentsWithoutAssembly();

    @Query("SELECT new com.app.compliance.dto.DocumentView(d.articlecode,  p.description, d.revision, d.documenttype, d.ppc, d.active, d.id) " +
        "FROM Document d  LEFT JOIN Product p " +
        "ON d.articlecode = p.code "+
        "WHERE d.assembly = TRUE")
    List<DocumentView> findDocumentsWithAssembly();

    @Query("SELECT new com.app.compliance.dto.DocumentView(d.articlecode,  c.description, d.revision, d.documenttype, d.ppc, d.active, d.id) " +
        "FROM Document d  LEFT JOIN Component c " +
        "ON d.articlecode = c.compid "+
        "WHERE d.assembly = FALSE AND d.active=TRUE")
    List<DocumentView> findActiveDocumentsWithoutAssembly();

    @Query("SELECT new com.app.compliance.dto.DocumentView(d.articlecode,  p.description, d.revision, d.documenttype, d.ppc, d.active, d.id) " +
        "FROM Document d  LEFT JOIN Product p " +
        "ON d.articlecode = p.code "+
        "WHERE d.assembly = TRUE AND d.active=TRUE")
    List<DocumentView> findActiveDocumentsWithAssembly();

    @Query("SELECT new com.app.compliance.dto.DocumentView(d.articlecode,  c.description, d.revision, d.documenttype, d.ppc, d.active, d.id) " +
        "FROM Document d  LEFT JOIN Component c " +
        "ON d.articlecode = c.compid "+
        "WHERE d.assembly = FALSE AND d.active=TRUE AND d.documenttype='InternalSpecification' AND c.compid=?1")
    List<DocumentView> findActiveSpecWithoutAssembly(String article);

    @Query("SELECT new com.app.compliance.dto.DocumentView(d.articlecode,  p.description, d.revision, d.documenttype, d.ppc, d.active, d.id) " +
        "FROM Document d  LEFT JOIN Product p " +
        "ON d.articlecode = p.code "+
        "WHERE d.assembly = TRUE AND d.active=TRUE AND d.documenttype='InternalSpecification' AND p.code=?1")
    List<DocumentView> findActiveSpecWithAssembly(String article);

}
