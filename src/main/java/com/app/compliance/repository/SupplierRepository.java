package com.app.compliance.repository;

import com.app.compliance.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier,Integer> {
    List<Supplier> findAll();

    Optional<Supplier> findById(Integer id);
}
