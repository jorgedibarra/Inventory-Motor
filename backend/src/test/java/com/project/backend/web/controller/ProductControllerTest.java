package com.project.backend.web.controller;

import com.project.backend.domain.Product;
import com.project.backend.domain.service.ProductService;
import org.aspectj.lang.annotation.Before;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductControllerTest {

    @InjectMocks
    private ProductController productController;

    @Mock
    private ProductService productService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }


    @Test
    public void testGetAllProducts() {
        // Arrange
        List<Product> mockProducts = new ArrayList<>();
        mockProducts.add(new Product());

        when(productService.getAll()).thenReturn(mockProducts);

        // Act
        ResponseEntity<List<Product>> response = productController.getAll();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertFalse(response.getBody().isEmpty());
        verify(productService, times(1)).getAll();
    }

    @Test
    public void testGetProductByIdFound() {
        // Arrange
        Product product = new Product();
        product.setProductId(1);

        when(productService.getProductById(1)).thenReturn(Optional.of(product));

        // Act
        ResponseEntity<Product> response = productController.getProduct(1);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().getProductId());
        verify(productService, times(1)).getProductById(1);
    }

    @Test
    public void testGetProductByIdNotFound() {
        // Arrange
        when(productService.getProductById(1)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<Product> response = productController.getProduct(1);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(productService, times(1)).getProductById(1);
    }

    @Test
    public void testSaveProduct() {
        // Arrange
        Product product = new Product();
        product.setName("Producto Test");

        when(productService.save(product)).thenReturn(product);

        // Act
        ResponseEntity<Product> response = productController.saveProduct(product);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("Producto Test", response.getBody().getName());
        verify(productService, times(1)).save(product);
    }

    @Test
    public void testDeleteProductSuccess() {
        // Arrange
        when(productService.deleteById(1)).thenReturn(true);

        // Act
        ResponseEntity response = productController.deleteProduct(1);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(productService, times(1)).deleteById(1);
    }

    @Test
    public void testDeleteProductNotFound() {
        // Arrange
        when(productService.deleteById(1)).thenReturn(false);

        // Act
        ResponseEntity response = productController.deleteProduct(1);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(productService, times(1)).deleteById(1);
    }
}