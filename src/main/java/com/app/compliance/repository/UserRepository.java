package com.app.compliance.repository;

import com.app.compliance.entities.Role;
import com.app.compliance.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User>findById(Integer id);

    Optional<User> findByEmail(String email);

    User findByRole(Role role);

    
}
