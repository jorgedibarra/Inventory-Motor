package com.project.backend.persistence.crud;

import com.project.backend.persistence.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProductoJpaRepository extends JpaRepository<Producto, Integer> {

    // Usando sql nativo
    @Query(value = "SELECT * FROM productos WHERE id_categoria = ?", nativeQuery = true)
    List<Producto> getAllCategoria(int idCategoria);

    // Usando query methods
    List<Producto> findByIdCategoriaOrderByNombreAsc(int idCategoria);

    Optional<List<Producto>> findByCantidadLessThan(int cantidad);

    List<Producto> findByNombreContainingIgnoreCase(String nombre);

    List<Producto> findByIdProveedor(int idProveedor);
}
