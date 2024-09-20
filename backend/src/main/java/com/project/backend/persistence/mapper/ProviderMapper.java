package com.project.backend.persistence.mapper;

import com.project.backend.domain.Provider;
import com.project.backend.persistence.entity.Proveedor;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProviderMapper {
    @Mappings({
            @Mapping(source = "idProveedor", target = "id"),
            @Mapping(source = "nombre", target = "name"),
            @Mapping(source = "numeroIdentificacion", target = "identificationDocument"),
            @Mapping(source = "direccion", target = "address"),
            @Mapping(source = "celular", target = "phone"),
            @Mapping(source = "correo", target = "email"),
    })
    Provider toProvider(Proveedor proveedor);
    List<Provider> toProviders(List<Proveedor> proveedores);

    @InheritInverseConfiguration
    @Mapping(target = "pedidos", ignore = true)
    Proveedor toProveedor(Provider provider);
}
