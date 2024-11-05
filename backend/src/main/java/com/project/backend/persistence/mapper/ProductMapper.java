package com.project.backend.persistence.mapper;

import com.project.backend.domain.Product;
import com.project.backend.domain.dto.ProductDto;
import com.project.backend.persistence.entity.Producto;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.List;

@Mapper(componentModel = "spring", uses = {CategoryMapper.class, ProviderMapper.class})
public interface ProductMapper {
    @Mappings({
            @Mapping(source = "idProducto", target = "productId"),
            @Mapping(source = "nombre", target = "name"),
            @Mapping(source = "descripcion", target = "description"),
            @Mapping(source = "idCategoria", target = "categoryId"),
            @Mapping(source = "idProveedor", target = "providerId"),
            @Mapping(source = "precioVenta", target = "priceSale"),
            @Mapping(source = "precioCompra", target = "priceBuy"),
            @Mapping(source = "iva", target = "vat"),
            @Mapping(source = "cantidad", target = "stock"),
            @Mapping(source = "fotoProducto", target = "image"),
            @Mapping(source = "estado", target = "state"),
            @Mapping(source = "categoria", target = "category"),
            @Mapping(source = "proveedor", target = "provider"),
    })
    Product toProduct(Producto producto);
    List<Product> toProducts(List<Producto> productos);

    @InheritInverseConfiguration
    Producto toProducto(Product product);

    @Mappings({
            @Mapping(source = "productId", target = "productId"),
            @Mapping(source = "name", target = "name"),
            @Mapping(source = "description", target = "description"),
            @Mapping(source = "categoryId", target = "categoryId"),
            @Mapping(source = "providerId", target = "providerId"),
            @Mapping(source = "priceSale", target = "priceSale"),
            @Mapping(source = "priceBuy", target = "priceBuy"),
            @Mapping(source = "vat", target = "vat"),
            @Mapping(source = "stock", target = "stock"),
            @Mapping(source = "image", target = "image"),
    })
    ProductDto toProductDto(Product product);
    List<ProductDto> toProductsDto(List<Product> products);

    @InheritInverseConfiguration
    @Mappings({
            @Mapping(target = "category", ignore = true),
            @Mapping(target = "provider", ignore = true)
    })
    Product toProduct(ProductDto productDto);
}
