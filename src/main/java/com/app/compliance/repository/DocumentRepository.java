package com.app.compliance.repository;
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

    

    @Query(value="select d.articlecode, c.description, d.revision, d.document_type, d.ppc, d.active\n" +
            "from documents d LEFT JOIN components c\n" +
            "ON d.articlecode = c.comp_id  \n" +
            "where d.assembly=FALSE\n" +
            "UNION\n" +
            "select d.articlecode, p.description, d.revision, d.document_type, d.ppc, d.active\n" +
            "from documents d LEFT JOIN products p\n" +
            "ON d.articlecode = p.code  \n" +
            "where d.assembly=TRUE ;",nativeQuery = true)
    List<Object[]>  getDocumentViews();


    @Query(value="select d.articlecode, c.description, d.revision, d.document_type, d.ppc, d.active\n" +
            "from documents d LEFT JOIN components c\n" +
            "ON d.articlecode = c.comp_id  \n" +
            "where d.assembly=FALSE AND d.active=true\n" +
            "UNION\n" +
            "select d.articlecode, p.description, d.revision, d.document_type, d.ppc, d.active\n" +
            "from documents d LEFT JOIN products p\n" +
            "ON d.articlecode = p.code  \n" +
            "where d.assembly=TRUE AND d.active=true;",nativeQuery = true)
    List<Object[]>  getActiveDocumentViews();


    @Query(value="select d.articlecode, c.description, d.revision, d.document_type, d.ppc, d.active\n" +
        "from documents d LEFT JOIN components c\n" +
        "ON d.articlecode = c.comp_id  \n" +
        "where d.assembly=FALSE AND d.active=true\n AND d.document_type='InternalSpecification' AND c.comp_id=?1\n" +
        "UNION\n" +
        "select d.articlecode, p.description, d.revision, d.document_type, d.ppc, d.active\n" +
        "from documents d LEFT JOIN products p\n" +
        "ON d.articlecode = p.code  \n" +
        "where d.assembly=TRUE AND d.active=true AND d.document_type='InternalSpecification' AND p.code=?1", nativeQuery = true)
    List<Object[]> getActiveSpec(String article);

    


}
