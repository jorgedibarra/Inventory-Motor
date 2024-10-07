package com.project.backend.persistence.mapper;

import com.project.backend.domain.SaleItem;
import com.project.backend.persistence.entity.DetalleVenta;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public interface SaleItemMapper {

    @Mappings({
            @Mapping(source = "id.idProducto", target = "productId"),
            @Mapping(source = "cantidad", target = "quantity"),
    })
    SaleItem toSaleItem(DetalleVenta detalleVenta);

    @InheritInverseConfiguration
    @Mappings({
            @Mapping(target = "venta", ignore = true),
            @Mapping(target = "producto", ignore = true),
            @Mapping(target = "id.idVenta", ignore = true)
    })
    DetalleVenta toDetalleVenta(SaleItem saleItem);
}
