package com.app.compliance.repository;

import com.app.compliance.model.Component;
import com.app.compliance.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    List<Product> findAll();

    Optional<Product>findByCode(String article);

    Optional<Product>findById(Integer id);
}
