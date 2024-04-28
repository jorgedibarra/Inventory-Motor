package com.project.backend.persistence;

import com.project.backend.persistence.crud.ProductoCrudRepository;
import com.project.backend.persistence.entity.Producto;

import java.util.List;
import java.util.Optional;

public class ProductoRepository {
    private ProductoCrudRepository productoCrudRepository;

    public List<Producto> getAll() {
        return (List<Producto>) productoCrudRepository.findAll();
    }

    public List<Producto> getByCategoriaAscendente(int idCategoria){
        return productoCrudRepository.findByIdCategoriaOrderByNombreAsc(idCategoria);
    }

    public  List<Producto> getByCategoria(int idCategoria){
        return productoCrudRepository.getAllCategoria(idCategoria);
    }

    public Optional<List<Producto>> getEscasos(int cantidad){
        return productoCrudRepository.findByCantidadLessThan(cantidad);
    }
}
