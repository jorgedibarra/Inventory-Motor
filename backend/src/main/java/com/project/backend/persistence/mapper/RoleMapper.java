package com.project.backend.persistence.mapper;

import com.project.backend.domain.Role;
import com.project.backend.persistence.entity.Rol;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    @Mappings({
            @Mapping(source = "id.nombreUsuario", target = "username"),
            @Mapping(source = "id.rol", target = "role"),
    })
    Role toRole(Rol rol);
    List<Role> toRoles(List<Rol> roles);

    @InheritInverseConfiguration
    @Mapping(target = "usuario", ignore = true)
    Rol toRol(Role role);
}
