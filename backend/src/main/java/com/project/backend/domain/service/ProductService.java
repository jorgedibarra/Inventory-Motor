package com.project.backend.domain.service;

import com.project.backend.domain.Product;
import com.project.backend.domain.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAll() {
        return productRepository.getAll();
    }

    public Optional<List<Product>> getByCategory(int categoryId) {
        return productRepository.getByCategory(categoryId);
    }

    public Optional<Product> getProductById(int productId)  {
        return productRepository.getProductById(productId);
    }

    public Product save(Product product) {
        return productRepository.save(product);
    }

    public boolean deleteById(int productId) {
        //if (getProductById(productId).isPresent()) {
        //    productRepository.delete(productId);
        //    return true;
        //} else {
        //    return false;
        //}
        return getProductById(productId).map(product -> {
            productRepository.delete(productId);
            return true;
        }).orElse(false);
    }
}
