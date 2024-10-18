package com.app.compliance.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;
import com.app.compliance.model.LogInfo;



@Repository
public interface LogRepository extends JpaRepository<LogInfo, Integer> {

    List<LogInfo> findAll();
    List<LogInfo> findByUsername(String username);

   
    List<LogInfo> findByTimeBetween(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);
    
}