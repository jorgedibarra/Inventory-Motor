package com.project.backend.persistence;

import com.project.backend.domain.Client;
import com.project.backend.domain.repository.ClientRepository;
import com.project.backend.persistence.crud.ClienteJpaRepository;
import com.project.backend.persistence.entity.Cliente;
import com.project.backend.persistence.mapper.ClientMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ClienteRepository implements ClientRepository {

    @Autowired
    private ClienteJpaRepository clienteJpaRepository;

    @Autowired
    private ClientMapper mapper;

    @Override
    public List<Client> getAll() {
        return mapper.toClients((List<Cliente>) clienteJpaRepository.findAll());
    }

    @Override
    public Optional<Client> getClient(int clientId) {
        return clienteJpaRepository.findById(clientId).map(cliente -> mapper.toClient(cliente));
    }

    @Override
    public Client save(Client client) {
        Cliente cliente = mapper.toCliente(client);
        return mapper.toClient(clienteJpaRepository.save(cliente));
    }

    @Override
    public void delete(int clientId) {
        clienteJpaRepository.deleteById(clientId);

    }

    @Override
    public Client update(Client client) {
        Cliente cliente = mapper.toCliente(client);
        return mapper.toClient(clienteJpaRepository.save(cliente));
    }
}
