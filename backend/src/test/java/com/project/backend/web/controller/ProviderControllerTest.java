package com.project.backend.web.controller;

import com.project.backend.domain.Provider;
import com.project.backend.domain.service.ProviderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProviderControllerTest {

    @InjectMocks
    private ProviderController providerController;

    @Mock
    private ProviderService providerService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testGetAllProviders() {
        // Arrange
        List<Provider> mockProviders = new ArrayList<>();
        mockProviders.add(new Provider());

        when(providerService.getAll()).thenReturn(mockProviders);

        // Act
        ResponseEntity<List<Provider>> response = providerController.getAll();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertFalse(response.getBody().isEmpty());
        verify(providerService, times(1)).getAll();
    }

    @Test
    public void testGetProviderByIdFound() {
        // Arrange
        Provider provider = new Provider();
        provider.setId(1);

        when(providerService.getProviderById(1)).thenReturn(Optional.of(provider));

        // Act
        ResponseEntity<Provider> response = providerController.getProviderById(1);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().getId());
        verify(providerService, times(1)).getProviderById(1);
    }

    @Test
    public void testGetProviderByIdNotFound() {
        // Arrange
        when(providerService.getProviderById(1)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<Provider> response = providerController.getProviderById(1);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(providerService, times(1)).getProviderById(1);
    }

    @Test
    public void testSaveProvider() {
        // Arrange
        Provider provider = new Provider();
        provider.setName("Proveedor Test");

        when(providerService.save(provider)).thenReturn(provider);

        // Act
        ResponseEntity<Provider> response = providerController.saveProvider(provider);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("Proveedor Test", response.getBody().getName());
        verify(providerService, times(1)).save(provider);
    }

    @Test
    public void testDeleteProviderSuccess() {
        // Arrange
        when(providerService.delete(1)).thenReturn(true);

        // Act
        ResponseEntity response = providerController.deleteProvider(1);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(providerService, times(1)).delete(1);
    }

    @Test
    public void testDeleteProviderNotFound() {
        // Arrange
        when(providerService.delete(1)).thenReturn(false);

        // Act
        ResponseEntity response = providerController.deleteProvider(1);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(providerService, times(1)).delete(1);
    }
}