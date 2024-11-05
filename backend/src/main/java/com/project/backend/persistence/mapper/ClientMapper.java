package com.project.backend.persistence.mapper;

import com.project.backend.domain.Client;
import com.project.backend.domain.dto.ClientDto;
import com.project.backend.persistence.entity.Cliente;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.List;

@Mapper(componentModel = "spring", uses = {SaleMapper.class})
public interface ClientMapper {

    @Mappings({
            @Mapping(source = "idCliente", target = "clientId"),
            @Mapping(source = "nombre", target = "name"),
            @Mapping(source = "apellido", target = "lastName"),
            @Mapping(source = "cedula", target = "document"),
            @Mapping(source = "direccion", target = "address"),
            @Mapping(source = "celular", target = "phone"),
            @Mapping(source = "correo", target = "email"),
            @Mapping(source = "estado", target = "state"),
            @Mapping(source = "ventas", target = "sales")
    })
    Client toClient(Cliente cliente);
    List<Client> toClients(List<Cliente> clientes);

    @InheritInverseConfiguration
    Cliente toCliente(Client client);

    @Mappings({
            @Mapping(source = "clientId", target = "clientId"),
            @Mapping(source = "name", target = "name"),
            @Mapping(source = "lastName", target = "lastName"),
            @Mapping(source = "document", target = "document"),
            @Mapping(source = "address", target = "address"),
            @Mapping(source = "phone", target = "phone"),
            @Mapping(source = "email", target = "email"),
            @Mapping(source = "state", target = "state")
    })
    ClientDto toClientDto(Client client);
    List<ClientDto> toClientDtos(List<Client> clients);

    @InheritInverseConfiguration
    @Mapping(target = "sales", ignore = true)
    Client toClient(ClientDto clientDto);
}
