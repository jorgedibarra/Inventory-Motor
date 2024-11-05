package com.project.backend.domain.service;

import com.project.backend.domain.Category;
import com.project.backend.domain.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAll(){
        return categoryRepository.getAll();
    }
    public Optional<List<Category>> getActiveCategories(boolean active){
        return  categoryRepository.getActiveCategories(active);
    }

    public Optional<Category> getCategoryById(int categoryId){
        return categoryRepository.getCategoryById(categoryId);
    }
    public Category save(Category category){
        return  categoryRepository.save(category);
    }
    public boolean delete(int categoryId){
        return getCategoryById(categoryId).map(category -> {
            categoryRepository.delete(categoryId);
            return true;
        }).orElse(false);
    }

    public Boolean changeStatus(Integer categoryId){
        Optional<Category> category = categoryRepository.getCategoryById(categoryId);
        if (category.isPresent()){
            category.get().setActive(!category.get().isActive());
            categoryRepository.save(category.get());
            return true;
        }
        return false;
    }
}
