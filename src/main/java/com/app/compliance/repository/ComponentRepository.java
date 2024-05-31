package com.app.compliance.repository;

import com.app.compliance.dto.QuickSearch;
import com.app.compliance.model.Component;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComponentRepository extends JpaRepository<Component,Integer> {

    List<Component> findAll();
    Optional<Component> findById(Integer article);
    Component findByCompid(String article);
    boolean existsByCompid(String article);
    boolean existsById(Integer id);




    @Query(value="SELECT comp_id AS 'article', 'COMPONENT' AS type, 'ARTICLE' AS field\n" +
            "FROM components\n" +
            "UNION\n" +
            "SELECT code, 'PRODUCT' AS type, 'ARTICLE' AS field\n" +
            "FROM products\n" +
            "UNION\n" +
            "SELECT supplier_name, 'SUPPLIER' AS type, 'ARTICLE' AS field\n" +
            "FROM suppliers\n" +
            "UNION\n" +
            "SELECT brandname, 'MATERIAL' AS type, 'ARTICLE' AS field\n" +
            "FROM materials\n" +
            "UNION\n" +
            "SELECT description, 'COMPONENT' AS type, 'DESCRIPTION' AS field\n" +
            "FROM components\n" +
            "UNION\n" +
            "SELECT description, 'PRODUCT' AS type, 'DESCRIPTION' AS field\n" +
            "FROM products\n" +
            ";",nativeQuery = true)
    List<Object[]>  findAllQuickLinks();
}
