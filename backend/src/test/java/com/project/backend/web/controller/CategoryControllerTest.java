package com.project.backend.web.controller;

import com.project.backend.domain.Category;
import com.project.backend.domain.service.CategoryService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CategoryControllerTest {

    @InjectMocks
    private CategoryController categoryController;

    @Mock
    private CategoryService categoryService;

    @Test
    public void testGetAllCategories() {
        // Arrange
        List<Category> mockCategories = new ArrayList<>();
        mockCategories.add(new Category());

        when(categoryService.getAll()).thenReturn(mockCategories);

        // Act
        ResponseEntity<List<Category>> response = categoryController.getAll();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertFalse(response.getBody().isEmpty());
        verify(categoryService, times(1)).getAll();
    }

    @Test
    public void testGetActiveCategoriesFound() {
        // Arrange
        List<Category> mockCategories = new ArrayList<>();
        mockCategories.add(new Category());

        when(categoryService.getActiveCategories(true)).thenReturn(Optional.of(mockCategories));

        // Act
        ResponseEntity<List<Category>> response = categoryController.getActiveCategories(true);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertFalse(response.getBody().isEmpty());
        verify(categoryService, times(1)).getActiveCategories(true);
    }

    @Test
    public void testGetActiveCategoriesNotFound() {
        // Arrange
        when(categoryService.getActiveCategories(true)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<List<Category>> response = categoryController.getActiveCategories(true);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(categoryService, times(1)).getActiveCategories(true);
    }

    @Test
    public void testGetCategoryByIdFound() {
        // Arrange
        Category category = new Category();
        category.setCategoryId(1);

        when(categoryService.getCategoryById(1)).thenReturn(Optional.of(category));

        // Act
        ResponseEntity<Category> response = categoryController.getCategoryById(1);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().getCategoryId());
        verify(categoryService, times(1)).getCategoryById(1);
    }

    @Test
    public void testGetCategoryByIdNotFound() {
        // Arrange
        when(categoryService.getCategoryById(1)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<Category> response = categoryController.getCategoryById(1);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(categoryService, times(1)).getCategoryById(1);
    }

    @Test
    public void testSaveCategory() {
        // Arrange
        Category category = new Category();
        category.setCategoryId(1);

        when(categoryService.save(category)).thenReturn(category);

        // Act
        ResponseEntity<Category> response = categoryController.save(category);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(1, response.getBody().getCategoryId());
        verify(categoryService, times(1)).save(category);
    }

    @Test
    public void testDeleteCategorySuccess() {
        // Arrange
        when(categoryService.delete(1)).thenReturn(true);

        // Act
        ResponseEntity response = categoryController.delete(1);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(categoryService, times(1)).delete(1);
    }

    @Test
    public void testDeleteCategoryNotFound() {
        // Arrange
        when(categoryService.delete(1)).thenReturn(false);

        // Act
        ResponseEntity response = categoryController.delete(1);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(categoryService, times(1)).delete(1);
    }
}
