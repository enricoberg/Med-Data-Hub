package com.app.compliance.repository;

import com.app.compliance.model.Component;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComponentRepository extends JpaRepository<Component,Integer> {

    List<Component> findAll();
    Optional<Component> findById(Integer article);
    Component findByCompid(String article);

}
