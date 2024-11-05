package com.project.backend.persistence;

import com.project.backend.domain.Product;
import com.project.backend.domain.repository.ProductRepository;
import com.project.backend.persistence.crud.ProductoJpaRepository;
import com.project.backend.persistence.entity.Producto;
import com.project.backend.persistence.mapper.ProductMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ProductoRepository implements ProductRepository {
    @Autowired
    private ProductoJpaRepository productoJpaRepository;

    @Autowired
    private ProductMapper productMapper;

    @Override
    public List<Product> getAll() {
        List<Producto> productos = productoJpaRepository.findByEstadoTrue();
        return productMapper.toProducts(productos);
    }

    @Override
    public List<Product> getByCategory(Integer categoryId) {
        List<Producto> productos = productoJpaRepository.findByIdCategoriaAndEstadoTrue(categoryId);
        return productMapper.toProducts(productos);
    }

    @Override
    public Optional<List<Product>> getScarseProducts(Integer quantity) {
        Optional<List<Producto>> productos = productoJpaRepository.findByCantidadLessThan(quantity);
        return productos.map(prods -> productMapper.toProducts(prods));
    }

    @Override
    public Optional<Product> getProductById(Integer productId) {
        return productoJpaRepository.findByIdProductoAndEstadoTrue(productId).map(producto -> productMapper.toProduct(producto));
    }

    @Override
    public Product save(Product product) {
        Producto producto = productMapper.toProducto(product);
        return productMapper.toProduct(productoJpaRepository.save(producto));
    }

    @Override
    public void delete(Integer productId) {
        productoJpaRepository.deleteById(productId);
    }

    public List<Producto> getByNombre(String nombre){
        return productoJpaRepository.findByNombreContainingIgnoreCase(nombre);
    }

    public List<Producto> getByProveedor(Integer idProveedor){
        return productoJpaRepository.findByIdProveedor(idProveedor);
    }
}


