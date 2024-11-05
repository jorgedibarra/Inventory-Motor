package com.project.backend.domain.service;

import com.project.backend.domain.Category;
import com.project.backend.domain.repository.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceTest {

    @InjectMocks
    private CategoryService categoryService;

    @Mock
    private CategoryRepository categoryRepository;

    @Test
    public void testGetAllCategories() {
        // Arrange
        List<Category> mockCategories = new ArrayList<>();
        mockCategories.add(new Category());

        when(categoryRepository.getAll()).thenReturn(mockCategories);

        // Act
        List<Category> categories = categoryService.getAll();

        // Assert
        assertFalse(categories.isEmpty());
        verify(categoryRepository, times(1)).getAll();
    }

    @Test
    public void testGetActiveCategoriesFound() {
        // Arrange
        List<Category> mockCategories = new ArrayList<>();
        mockCategories.add(new Category());

        when(categoryRepository.getActiveCategories(true)).thenReturn(Optional.of(mockCategories));

        // Act
        Optional<List<Category>> foundCategories = categoryService.getActiveCategories(true);

        // Assert
        assertTrue(foundCategories.isPresent());
        assertFalse(foundCategories.get().isEmpty());
        verify(categoryRepository, times(1)).getActiveCategories(true);
    }

    @Test
    public void testGetActiveCategoriesNotFound() {
        // Arrange
        when(categoryRepository.getActiveCategories(true)).thenReturn(Optional.empty());

        // Act
        Optional<List<Category>> foundCategories = categoryService.getActiveCategories(true);

        // Assert
        assertFalse(foundCategories.isPresent());
        verify(categoryRepository, times(1)).getActiveCategories(true);
    }

    @Test
    public void testGetCategoryByIdFound() {
        // Arrange
        Category category = new Category();
        category.setCategoryId(1);

        when(categoryRepository.getCategoryById(1)).thenReturn(Optional.of(category));

        // Act
        Optional<Category> foundCategory = categoryService.getCategoryById(1);

        // Assert
        assertTrue(foundCategory.isPresent());
        assertEquals(1, foundCategory.get().getCategoryId());
        verify(categoryRepository, times(1)).getCategoryById(1);
    }

    @Test
    public void testGetCategoryByIdNotFound() {
        // Arrange
        when(categoryRepository.getCategoryById(1)).thenReturn(Optional.empty());

        // Act
        Optional<Category> foundCategory = categoryService.getCategoryById(1);

        // Assert
        assertFalse(foundCategory.isPresent());
        verify(categoryRepository, times(1)).getCategoryById(1);
    }

    @Test
    public void testSaveCategory() {
        // Arrange
        Category category = new Category();
        category.setCategoryId(1);

        when(categoryRepository.save(category)).thenReturn(category);

        // Act
        Category savedCategory = categoryService.save(category);

        // Assert
        assertNotNull(savedCategory);
        assertEquals(1, savedCategory.getCategoryId());
        verify(categoryRepository, times(1)).save(category);
    }

    @Test
    public void testDeleteCategorySuccess() {
        // Arrange
        Category category = new Category();
        category.setCategoryId(1);

        when(categoryRepository.getCategoryById(1)).thenReturn(Optional.of(category));
        doNothing().when(categoryRepository).delete(1);

        // Act
        boolean isDeleted = categoryService.delete(1);

        // Assert
        assertTrue(isDeleted);
        verify(categoryRepository, times(1)).getCategoryById(1);
        verify(categoryRepository, times(1)).delete(1);
    }

    @Test
    public void testDeleteCategoryNotFound() {
        // Arrange
        when(categoryRepository.getCategoryById(1)).thenReturn(Optional.empty());

        // Act
        boolean isDeleted = categoryService.delete(1);

        // Assert
        assertFalse(isDeleted);
        verify(categoryRepository, times(1)).getCategoryById(1);
        verify(categoryRepository, never()).delete(1);
    }
}
