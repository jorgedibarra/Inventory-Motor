package com.project.backend.persistence.mapper;

import com.project.backend.domain.Sale;
import com.project.backend.persistence.entity.Venta;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.List;

@Mapper(componentModel = "spring", uses = {SaleItemMapper.class})
public interface SaleMapper {

    @Mappings({
            @Mapping(source = "idVenta", target = "saleId"),
            @Mapping(source = "idCliente", target = "clientId"),
            @Mapping(source = "fecha", target = "date"),
            @Mapping(source = "medioPago", target = "paymentMethod"),
            @Mapping(source = "productos", target = "items")
    })
    Sale toSale(Venta venta);
    List<Sale> toSales(List<Venta> ventas);

    @InheritInverseConfiguration
    @Mapping(target = "cliente", ignore = true)
    Venta toVenta(Sale sale);
}
