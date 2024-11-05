package com.project.backend.persistence.crud;

import com.project.backend.persistence.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoriaJpaRepository extends JpaRepository<Categoria, Integer> {

    List<Categoria> findByNombre(String nombre);

    List<Categoria> findByNombreContainingIgnoreCase(String nombre);

    List<Categoria> findByEstado(Boolean estado);

    List<Categoria> findByEstadoTrue();

    Optional<Categoria> findByIdCategoriaAndEstadoTrue(Integer idCategoria);
}
