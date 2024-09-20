package com.project.backend.persistence;

import com.project.backend.domain.Category;
import com.project.backend.domain.repository.CategoryRepository;
import com.project.backend.persistence.crud.CategoriaJpaRepository;
import com.project.backend.persistence.entity.Categoria;
import com.project.backend.persistence.mapper.CategoryMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class CategoriaRepository implements CategoryRepository {
    @Autowired
    private CategoriaJpaRepository categoriaJpaRepository;

    @Autowired
    private CategoryMapper categoryMapper;

    @Override
    public List<Category> getAll() {
        List<Categoria> categorias = (List<Categoria>) categoriaJpaRepository.findAll();
        return categoryMapper.toCategorys(categorias);
    }

    @Override
    public Optional<List<Category>> getActiveCategories(boolean activas) {
        List<Categoria> categorias =  categoriaJpaRepository.findByEstado(activas);
        return Optional.of(categoryMapper.toCategorys(categorias));
    }

    @Override
    public Optional<Category> getCategoryById(int categoryId) {
        return categoriaJpaRepository.findById(categoryId).map(categoria -> categoryMapper.toCategory(categoria));
    }

    @Override
    public Category save(Category category) {
        Categoria categoria = categoryMapper.toCategoria(category);
        return categoryMapper.toCategory(categoriaJpaRepository.save(categoria));
    }

    @Override
    public void delete(int categoryId) {
        categoriaJpaRepository.deleteById(categoryId);
    }
}
