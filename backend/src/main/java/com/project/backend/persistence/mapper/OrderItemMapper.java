package com.project.backend.persistence.mapper;

import com.project.backend.domain.OrderItem;
import com.project.backend.persistence.entity.DetallePedido;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public interface OrderItemMapper {

    @Mappings({
            @Mapping(source = "id.idProducto", target = "productId"),
            @Mapping(source = "cantidad", target = "quantity"),
    })
    OrderItem toOrderItem(DetallePedido detallePedido);

    @InheritInverseConfiguration
    @Mappings({
            @Mapping(target = "pedido", ignore = true),
            @Mapping(target = "producto", ignore = true),
            @Mapping(target = "id.idPedido", ignore = true)
    })
    DetallePedido toDetallePedido(OrderItem orderItem);
}
