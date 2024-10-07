package com.project.backend.persistence.crud;

import com.project.backend.persistence.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoriaJpaRepository extends JpaRepository<Categoria, Integer> {
    List<Categoria> findAllByOrderByIdCategoriaAsc();

    List<Categoria> findByNombre(String nombre);

    List<Categoria> findByNombreContainingIgnoreCase(String nombre);

    List<Categoria> findByEstado(Boolean estado);


}
