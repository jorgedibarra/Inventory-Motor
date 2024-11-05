package com.project.backend.persistence.mapper;

import com.project.backend.domain.Order;
import com.project.backend.persistence.entity.Pedido;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.List;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class})
public interface OrderMapper {

    @Mappings({
        @Mapping(source = "idPedido", target = "idOrder"),
        @Mapping(source = "idProveedor", target = "idProvider"),
        @Mapping(source = "fecha", target = "date"),
        @Mapping(source = "productos", target = "products"),
        @Mapping(source = "estado", target = "state")
    })
    Order toOrder(Pedido pedido);
    List<Order> toOrders(List<Pedido> pedidos);

    @InheritInverseConfiguration
    @Mappings({
        @Mapping(target = "proveedor", ignore = true)
    })
    Pedido toPedido(Order order);
}
