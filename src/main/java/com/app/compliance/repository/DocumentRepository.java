package com.app.compliance.repository;
import com.app.compliance.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface DocumentRepository extends JpaRepository<Document, Integer> {

    List<Document> findByArticlenumberContaining(String searchString);
    List<Document> findByRevisionContainingAndArticlenumberContaining(String revision, String articlenumber);

    List<Document> findByRevisionContainingAndArticlenumberContainingAndActive(String revision, String articlenumber, boolean active);

//    @Query(value="SELECT c.comp_id,c.description, d.revision, d.document_type, d.ppc " +
//            "FROM documents AS d " +
//            "JOIN components AS c ON d.article_number = c.id;", nativeQuery = true)
//    List<Object[]>  getDocumentViews();


    @Query("select c.comp_id, c.description, d.revision, d.documenttype, d.ppc, d.active from Document d JOIN d.articlenumber c ")
    List<Object[]>  getDocumentViews();


}
