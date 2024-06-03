package com.app.compliance.repository;

import com.app.compliance.model.Material;
import com.app.compliance.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Integer> {

    List<Material> findAll();
    Optional<Material> findById(Integer id);
    boolean existsById(Integer id);
}
