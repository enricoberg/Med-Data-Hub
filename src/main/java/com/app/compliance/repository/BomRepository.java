package com.app.compliance.repository;

import com.app.compliance.model.Bom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BomRepository extends JpaRepository<Bom, Integer> {

    List<Bom> findAll();

//    List<Bom> findByProdid(String prodid);
}
