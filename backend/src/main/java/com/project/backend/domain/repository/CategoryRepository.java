package com.project.backend.domain.repository;

import com.project.backend.domain.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository {
    List<Category> getAll();
    Optional<List<Category>> getActiveCategories(boolean active);
    Optional<Category> getCategoryById(int categoryId);
    Category save(Category category);
    void delete(int categoryId);

}
