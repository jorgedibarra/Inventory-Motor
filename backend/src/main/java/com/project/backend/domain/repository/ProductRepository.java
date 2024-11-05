package com.project.backend.domain.repository;

import com.project.backend.domain.Product;

import java.util.List;
import java.util.Optional;

public interface ProductRepository {
    List<Product> getAll();
    List<Product> getByCategory(Integer categoryId);
    Optional<List<Product>> getScarseProducts(Integer quantity);
    Optional<Product> getProductById(Integer productId);
    Product save(Product product);
    void delete(Integer product);
}
