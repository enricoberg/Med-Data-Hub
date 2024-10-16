package com.app.compliance.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.compliance.model.LogInfo;



@Repository
public interface LogRepository extends JpaRepository<LogInfo, Integer> {

    List<LogInfo> findAll();
    
}