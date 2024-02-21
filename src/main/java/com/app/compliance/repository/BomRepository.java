package com.app.compliance.repository;

import com.app.compliance.model.Bom;
import com.app.compliance.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BomRepository extends JpaRepository<Bom, Integer> {

    List<Bom> findAll();

    Optional<Bom> findByProdidAndCompid(Product prodid, Integer compid);
//    List<Bom> findByProdid(String prodid);
}
