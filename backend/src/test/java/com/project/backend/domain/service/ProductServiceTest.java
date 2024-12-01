package com.project.backend.domain.service;

import com.project.backend.domain.Product;
import com.project.backend.domain.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductServiceTest {

    @InjectMocks
    private ProductService productService;

    @Mock
    private ProductRepository productRepository;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllProducts() {
        // Arrange
        List<Product> mockProducts = new ArrayList<>();
        mockProducts.add(new Product()); // Agrega un producto simulado

        System.out.println("-----------------");
        System.out.println(mockProducts.add(new Product()));

        when(productRepository.getAll()).thenReturn(mockProducts);

        // Act
        List<Product> products = productService.getAll();

        // Assert
        assertFalse(products.isEmpty());
        verify(productRepository, times(1)).getAll();
    }

    @Test
    public void testGetProductByIdFound() {
        // Arrange
        Product product = new Product();
        product.setProductId(1);
        when(productRepository.getProductById(1)).thenReturn(Optional.of(product));

        // Act
        Optional<Product> foundProduct = productService.getProductById(1);

        // Assert
        assertTrue(foundProduct.isPresent());
        assertEquals(1, foundProduct.get().getProductId());
        verify(productRepository, times(1)).getProductById(1);
    }

    @Test
    public void testGetProductByIdNotFound() {
        // Arrange
        when(productRepository.getProductById(1)).thenReturn(Optional.empty());

        // Act
        Optional<Product> foundProduct = productService.getProductById(1);

        // Assert
        assertFalse(foundProduct.isPresent());
        verify(productRepository, times(1)).getProductById(1);
    }

    @Test
    public void testSaveProduct() {
        // Arrange
        Product product = new Product();
        product.setName("Producto Test");

        when(productRepository.save(product)).thenReturn(product);

        // Act
        Product savedProduct = productService.save(product);

        // Assert
        assertNotNull(savedProduct);
        assertEquals("Producto Test", savedProduct.getName());
        verify(productRepository, times(1)).save(product);
    }

    @Test
    public void testDeleteProductSuccess() {
        // Arrange
        Product product = new Product();
        product.setProductId(1);

        when(productRepository.getProductById(1)).thenReturn(Optional.of(product));
        doNothing().when(productRepository).delete(1);

        // Act
        boolean isDeleted = productService.deleteById(1);

        // Assert
        assertTrue(isDeleted);
        verify(productRepository, times(1)).getProductById(1);
        verify(productRepository, times(1)).delete(1);
    }

    @Test
    public void testDeleteProductNotFound() {
        // Arrange
        when(productRepository.getProductById(1)).thenReturn(Optional.empty());

        // Act
        boolean isDeleted = productService.deleteById(1);

        // Assert
        assertFalse(isDeleted);
        verify(productRepository, times(1)).getProductById(1);
        verify(productRepository, never()).delete(1);
    }
}