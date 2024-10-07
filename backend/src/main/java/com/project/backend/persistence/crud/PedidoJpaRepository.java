package com.project.backend.persistence.crud;

import com.project.backend.persistence.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PedidoJpaRepository extends JpaRepository<Pedido, Integer> {
    Optional<List<Pedido>> findByIdProveedor(Integer idProveedor);
}
