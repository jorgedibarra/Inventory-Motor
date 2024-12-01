package com.project.backend.domain.service;

import com.project.backend.domain.Client;
import com.project.backend.domain.repository.ClientRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClientServiceTest {

    @InjectMocks
    private ClientService clientService;

    @Mock
    private ClientRepository clientRepository;


    @Test
    public void testGetAllClients() {
        // Arrange
        List<Client> mockClients = new ArrayList<>();
        mockClients.add(new Client()); // Agrega un cliente simulado

        when(clientRepository.getAll()).thenReturn(mockClients);

        // Act
        List<Client> clients = clientService.getAll();

        // Assert
        assertFalse(clients.isEmpty());
        verify(clientRepository, times(1)).getAll();
    }

    @Test
    public void testGetClientByIdFound() {
        // Arrange
        Client client = new Client();
        client.setClientId(1);

        when(clientRepository.getClient(1)).thenReturn(Optional.of(client));

        // Act
        Optional<Client> foundClient = clientService.getClient(1);

        // Assert
        assertTrue(foundClient.isPresent());
        assertEquals(1, foundClient.get().getClientId());
        verify(clientRepository, times(1)).getClient(1);
    }

    @Test
    public void testGetClientByIdNotFound() {
        // Arrange
        when(clientRepository.getClient(1)).thenReturn(Optional.empty());

        // Act
        Optional<Client> foundClient = clientService.getClient(1);

        // Assert
        assertFalse(foundClient.isPresent());
        verify(clientRepository, times(1)).getClient(1);
    }

    @Test
    public void testSaveClient() {
        // Arrange
        Client client = new Client();
        client.setName("Cliente Test");

        when(clientRepository.save(client)).thenReturn(client);

        // Act
        Client savedClient = clientService.save(client);

        // Assert
        assertNotNull(savedClient);
        assertEquals("Cliente Test", savedClient.getName());
        verify(clientRepository, times(1)).save(client);
    }

    @Test
    public void testDeleteClientSuccess() {
        // Arrange
        Client client = new Client();
        client.setClientId(1);

        when(clientRepository.getClient(1)).thenReturn(Optional.of(client));
        doNothing().when(clientRepository).delete(1);

        // Act
        boolean isDeleted = clientService.delete(1);

        // Assert
        assertTrue(isDeleted);
        verify(clientRepository, times(1)).getClient(1);
        verify(clientRepository, times(1)).delete(1);
    }

    @Test
    public void testDeleteClientNotFound() {
        // Arrange
        when(clientRepository.getClient(1)).thenReturn(Optional.empty());

        // Act
        boolean isDeleted = clientService.delete(1);

        // Assert
        assertFalse(isDeleted);
        verify(clientRepository, times(1)).getClient(1);
        verify(clientRepository, never()).delete(1);
    }

    @Test
    public void testUpdateClient() {
        // Arrange
        Client client = new Client();
        client.setClientId(1);
        client.setName("Cliente Actualizado");

        when(clientRepository.update(client)).thenReturn(client);

        // Act
        Client updatedClient = clientService.update(client);

        // Assert
        assertNotNull(updatedClient);
        assertEquals("Cliente Actualizado", updatedClient.getName());
        verify(clientRepository, times(1)).update(client);
    }
}