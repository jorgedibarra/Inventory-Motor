package com.project.backend.domain.service;

import com.project.backend.domain.Client;
import com.project.backend.domain.dto.ClientDto;
import com.project.backend.domain.repository.ClientRepository;
import com.project.backend.persistence.mapper.ClientMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ClientMapper mapper;

    public List<ClientDto> getAll() {
        return mapper.toClientDtos(clientRepository.getAll());
    }

    public Optional<ClientDto> getClient(int clientId) {
        return clientRepository.getClient(clientId).map(client -> mapper.toClientDto(client));
    }

    public ClientDto save(Client client) {
        return mapper.toClientDto(clientRepository.save(client));
    }

    public boolean delete(int clientId) {
        return getClient(clientId).map(client -> {
            clientRepository.delete(clientId);
            return true;
        }).orElse(false);
    }

    public ClientDto update(Client client) {
        return mapper.toClientDto(clientRepository.update(client));
    }

    public Boolean changeState(Integer clientId) {
        Optional<Client> client = clientRepository.getClient(clientId);
        if (client.isPresent()) {
            client.get().setState(false);
            clientRepository.update(client.get());
            return true;
        }
        return false;
    }
}
