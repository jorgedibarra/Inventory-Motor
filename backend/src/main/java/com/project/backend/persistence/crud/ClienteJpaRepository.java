package com.project.backend.persistence.crud;

import com.project.backend.persistence.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClienteJpaRepository extends JpaRepository<Cliente, Integer> {
    Optional<Cliente> findByIdClienteAndEstadoTrue(Integer idCliente);
    Optional<List<Cliente>> findByNombre(String nombre);
    List<Cliente> findByEstadoTrue();
}
