package com.project.backend.persistence;

import com.project.backend.domain.Product;
import com.project.backend.domain.repository.ProductRepository;
import com.project.backend.persistence.crud.ProductoJpaRepository;
import com.project.backend.persistence.entity.Producto;
import com.project.backend.persistence.mapper.ProductMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ProductoRepository implements ProductRepository {

    private ProductoJpaRepository productoJpaRepository;
    private ProductMapper productMapper;

    @Override
    public List<Product> getAll() {
        List<Producto> productos = (List<Producto>) productoJpaRepository.findAll();
        return productMapper.toProducts(productos);
    }

    @Override
    public Optional<List<Product>> getByCategory(int categoryId) {
        List<Producto> productos = productoJpaRepository.findByIdCategoriaOrderByNombreAsc(categoryId);
        return Optional.of(productMapper.toProducts(productos));
    }

    @Override
    public Optional<List<Product>> getScarseProducts(int quantity) {
        Optional<List<Producto>> productos = productoJpaRepository.findByCantidadLessThan(quantity);
        return productos.map(prods -> productMapper.toProducts(prods));
    }

    @Override
    public Optional<Product> getProductById(int productId) {
        return productoJpaRepository.findById(productId).map(producto -> productMapper.toProduct(producto));
    }

    @Override
    public Product save(Product product) {
        Producto producto = productMapper.toProducto(product);
        return productMapper.toProduct(productoJpaRepository.save(producto));
    }

    @Override
    public void delete(int productId) {
        productoJpaRepository.deleteById(productId);
    }

    public List<Producto> getByNombre(String nombre){
        return productoJpaRepository.findByNombreContainingIgnoreCase(nombre);
    }

    public List<Producto> getByProveedor(int idProveedor){
        return productoJpaRepository.findByIdProveedor(idProveedor);
    }
}


