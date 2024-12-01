package com.project.backend.web.controller;

import com.project.backend.domain.Client;
import com.project.backend.domain.dto.ClientDto;
import com.project.backend.domain.service.ClientService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClientControllerTest {

    @InjectMocks
    private ClientController clientController;

    @Mock
    private ClientService clientService;

    @Test
    public void testGetAllClients() {
        // Arrange
        List<ClientDto> mockClients = new ArrayList<>();
        mockClients.add(new ClientDto());

        when(clientService.getAll()).thenReturn(mockClients);

        // Act
        ResponseEntity<List<ClientDto>> response = clientController.getAll();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertFalse(response.getBody().isEmpty());
        verify(clientService, times(1)).getAll();
    }

    @Test
    public void testGetClientByIdFound() {
        // Arrange
        Client client = new Client();
        client.setClientId(1);

        when(clientService.getClient(1)).thenReturn(Optional.of(client));

        // Act
        ResponseEntity<Client> response = clientController.getClient(1);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().getClientId());
        verify(clientService, times(1)).getClient(1);
    }

    @Test
    public void testGetClientByIdNotFound() {
        // Arrange
        when(clientService.getClient(1)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<Client> response = clientController.getClient(1);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(clientService, times(1)).getClient(1);
    }

    @Test
    public void testSaveClient() {
        // Arrange
        Client client = new Client();
        client.setName("Cliente Test");

        when(clientService.save(client)).thenReturn(client);

        // Act
        ResponseEntity<Client> response = clientController.save(client);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("Cliente Test", response.getBody().getName());
        verify(clientService, times(1)).save(client);
    }

    @Test
    public void testDeleteClientSuccess() {
        // Arrange
        when(clientService.delete(1)).thenReturn(true);

        // Act
        ResponseEntity<Boolean> response = clientController.delete(1);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody());
        verify(clientService, times(1)).delete(1);
    }

    @Test
    public void testDeleteClientNotFound() {
        // Arrange
        when(clientService.delete(1)).thenReturn(false);

        // Act
        ResponseEntity<Boolean> response = clientController.delete(1);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertFalse(response.getBody());
        verify(clientService, times(1)).delete(1);
    }

    @Test
    public void testUpdateClient() {
        // Arrange
        Client client = new Client();
        client.setClientId(1);
        client.setName("Cliente Actualizado");

        when(clientService.update(client)).thenReturn(client);

        // Act
        ResponseEntity<Client> response = clientController.update(client);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Cliente Actualizado", response.getBody().getName());
        verify(clientService, times(1)).update(client);
    }

}