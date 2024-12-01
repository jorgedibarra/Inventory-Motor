package com.project.backend.domain.service;

import com.project.backend.domain.Category;
import com.project.backend.domain.Product;
import com.project.backend.domain.Provider;
import com.project.backend.domain.dto.ProductDto;
import com.project.backend.domain.repository.CategoryRepository;
import com.project.backend.domain.repository.ProductRepository;
import com.project.backend.domain.repository.ProviderRepository;
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
    private CategoryRepository categoryRepository;

    @Autowired
    private ProviderRepository providerRepository;

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

    public ProductDto update(ProductDto productDto) {
        // Validar existencia del producto
        Optional<Product> existingProductOpt = productRepository.getProductById(productDto.getProductId());
        if (existingProductOpt.isEmpty()) {
            throw new IllegalArgumentException("El producto con ID " + productDto.getProductId() + " no existe.");
        }

        // Obtener el producto existente
        Product existingProduct = existingProductOpt.get();

        // Actualizar solo los campos permitidos
        existingProduct.setName(productDto.getName());
        existingProduct.setDescription(productDto.getDescription());
        existingProduct.setPriceSale(productDto.getPriceSale());
        existingProduct.setPriceBuy(productDto.getPriceBuy());
        existingProduct.setVat(productDto.getVat());
        existingProduct.setStock(productDto.getStock());
        existingProduct.setImage(productDto.getImage());
        existingProduct.setState(productDto.isState());

        // Validar que las categorías y proveedores referenciados existen
        Optional<Category> category = categoryRepository.getCategoryById(productDto.getCategoryId());
        if (category.isEmpty()) {  // Usar isEmpty() para verificar si no está presente
            throw new IllegalArgumentException("La categoría con ID " + productDto.getCategoryId() + " no existe.");
        }

        Optional<Provider> provider = providerRepository.getProviderById(productDto.getProviderId());
        if (provider.isEmpty()) {  // Usar isEmpty() para verificar si no está presente
            throw new IllegalArgumentException("El proveedor con ID " + productDto.getProviderId() + " no existe.");
        }

        // Solo actualizar las referencias, no las entidades completas
        existingProduct.setCategoryId(productDto.getCategoryId());
        existingProduct.setProviderId(productDto.getProviderId());


        // Guardar los cambios
        return productMapper.toProductDto(productRepository.save(existingProduct));
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
