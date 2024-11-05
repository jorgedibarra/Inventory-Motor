package com.project.backend.persistence.mapper;

import com.project.backend.domain.User;
import com.project.backend.persistence.entity.Usuario;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.List;

@Mapper(componentModel = "spring", uses = {RoleMapper.class})
public interface UserMapper {

    @Mappings({
            @Mapping(source = "nombre", target = "name"),
            @Mapping(source = "correo", target = "email"),
            @Mapping(source = "fechaCreacion", target = "createdDate"),
            @Mapping(source = "contrasena", target = "password"),
            @Mapping(source = "foto", target = "photo"),
            @Mapping(source = "estado", target = "state"),
            @Mapping(source = "roles", target = "roles")
    })
    User toUser(Usuario usuario);
    List<User> toUsers(List<Usuario> usuarios);

    @InheritInverseConfiguration
    Usuario toUsuario(User user);
}
