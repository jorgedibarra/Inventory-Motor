package com.project.backend.persistence.crud;

import com.project.backend.persistence.entity.DetalleVenta;
import com.project.backend.persistence.entity.DetalleVentaPK;
import com.project.backend.persistence.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public interface VentaJpaRepository extends JpaRepository<Venta, Integer> {
    Optional<List<Venta>> findByIdCliente(Integer idCliente);
    List<Venta> findByEstadoTrue();
    Optional<Venta> findByIdVentaAndEstadoTrue(Integer idVenta);
    }

