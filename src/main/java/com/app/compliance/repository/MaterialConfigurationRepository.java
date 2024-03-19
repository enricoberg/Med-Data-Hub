package com.app.compliance.repository;

import com.app.compliance.model.MaterialConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaterialConfigurationRepository extends JpaRepository<MaterialConfiguration,Integer> {

    List<MaterialConfiguration> findAll();

    List<MaterialConfiguration> findByMaterialidAndConfid(Integer materialid, Integer configurationid);

    List<MaterialConfiguration> findByMaterialid(Integer materialid);
}
