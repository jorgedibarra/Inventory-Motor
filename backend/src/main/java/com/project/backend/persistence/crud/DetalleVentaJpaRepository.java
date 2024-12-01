package com.project.backend.persistence.crud;

import com.project.backend.persistence.entity.DetalleVenta;
import com.project.backend.persistence.entity.DetalleVentaPK;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DetalleVentaJpaRepository extends JpaRepository<DetalleVenta, DetalleVentaPK> {
}
