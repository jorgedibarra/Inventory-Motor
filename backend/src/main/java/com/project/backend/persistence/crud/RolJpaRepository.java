package com.project.backend.persistence.crud;

import com.project.backend.persistence.entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RolJpaRepository extends JpaRepository<Rol, String> {
}
