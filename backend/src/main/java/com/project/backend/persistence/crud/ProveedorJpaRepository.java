package com.project.backend.persistence.crud;


import com.project.backend.persistence.entity.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProveedorJpaRepository extends JpaRepository<Proveedor, Integer> {
    List<Proveedor> findByNombre(String nombre);

    List<Proveedor> findByNombreContaining(String nombre);

    Optional<Proveedor> findByIdProveedorAndEstadoTrue(Integer idCliente);
    List<Proveedor> findByEstadoTrue();
}
