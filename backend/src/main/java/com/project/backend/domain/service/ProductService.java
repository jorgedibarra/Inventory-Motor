package com.project.backend.domain.service;

import com.project.backend.domain.Product;
import com.project.backend.domain.dto.ProductDto;
import com.project.backend.domain.repository.ProductRepository;
import com.project.backend.persistence.mapper.ProductMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductMapper productMapper;

    public List<ProductDto> getAll() {
        return productMapper.toProductsDto(productRepository.getAll());
    }

    public List<ProductDto> getByCategory(int categoryId) {
        return productMapper.toProductsDto(productRepository.getByCategory(categoryId));
    }

    public Optional<ProductDto> getProductById(int productId)  {
        return productRepository.getProductById(productId).map(product -> productMapper.toProductDto(product));
    }

    public ProductDto save(ProductDto product) {
        return productMapper.toProductDto(productRepository.save(productMapper.toProduct(product)));
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

    public Boolean changeState(Integer productId) {
        Optional<Product> product = productRepository.getProductById(productId);
        if (product.isPresent()) {
            product.get().setState(false);
            productRepository.save(product.get());
            return true;
        }
        return false;
    }
}
