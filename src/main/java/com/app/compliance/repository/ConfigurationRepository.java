package com.app.compliance.repository;

import com.app.compliance.model.Component;
import com.app.compliance.model.Configuration;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConfigurationRepository extends JpaRepository<Configuration, Integer> {
    List<Configuration> findAll();

    Optional<Configuration> findBySuppliercompnumber(String code);

    List<Configuration> findByCompid(Integer comp_id);




    @Modifying
    @Transactional
    @Query(value = "INSERT INTO configuration_material (configuration_id, material_id) VALUES (:value1, :value2)", nativeQuery = true)
    void insertMaterialConfiguration(@Param("value1") int configuration_id, @Param("value2") int material_id);


}
