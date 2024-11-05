package com.project.backend.persistence.crud;

import com.project.backend.persistence.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VentaJpaRepository extends JpaRepository<Venta, Integer> {
    Optional<List<Venta>> findByIdCliente(Integer idCliente);
    List<Venta> findByEstadoTrue();
    Optional<Venta> findByIdVentaAndEstadoTrue(Integer idVenta);
}
