package com.app.compliance.dto;

import com.app.compliance.repository.ComponentRepository;
import com.app.compliance.repository.ProductRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

@Data
@NoArgsConstructor
public class ComponentExplosion {



    private Integer id;
    private boolean assembly;
    private boolean controlled;
    private Integer level;


}
