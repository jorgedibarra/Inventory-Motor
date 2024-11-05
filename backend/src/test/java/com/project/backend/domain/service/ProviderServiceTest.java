package com.project.backend.domain.service;

import com.project.backend.domain.Provider;
import com.project.backend.domain.repository.ProviderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProviderServiceTest {

    @InjectMocks
    private ProviderService providerService;

    @Mock
    private ProviderRepository providerRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testGetAllProviders() {
        // Arrange
        List<Provider> mockProviders = new ArrayList<>();
        mockProviders.add(new Provider()); // Agrega un proveedor simulado

        when(providerRepository.getAll()).thenReturn(mockProviders);

        // Act
        List<Provider> providers = providerService.getAll();

        // Assert
        assertFalse(providers.isEmpty());
        verify(providerRepository, times(1)).getAll();
    }

    @Test
    public void testGetProviderByIdFound() {
        // Arrange
        Provider provider = new Provider();
        provider.setId(1);

        when(providerRepository.getProviderById(1)).thenReturn(Optional.of(provider));

        // Act
        Optional<Provider> foundProvider = providerService.getProviderById(1);

        // Assert
        assertTrue(foundProvider.isPresent());
        assertEquals(1, foundProvider.get().getId());
        verify(providerRepository, times(1)).getProviderById(1);
    }

    @Test
    public void testGetProviderByIdNotFound() {
        // Arrange
        when(providerRepository.getProviderById(1)).thenReturn(Optional.empty());

        // Act
        Optional<Provider> foundProvider = providerService.getProviderById(1);

        // Assert
        assertFalse(foundProvider.isPresent());
        verify(providerRepository, times(1)).getProviderById(1);
    }

    @Test
    public void testSaveProvider() {
        // Arrange
        Provider provider = new Provider();
        provider.setName("Proveedor Test");

        when(providerRepository.save(provider)).thenReturn(provider);

        // Act
        Provider savedProvider = providerService.save(provider);

        // Assert
        assertNotNull(savedProvider);
        assertEquals("Proveedor Test", savedProvider.getName());
        verify(providerRepository, times(1)).save(provider);
    }

    @Test
    public void testDeleteProviderSuccess() {
        // Arrange
        Provider provider = new Provider();
        provider.setId(1);

        when(providerRepository.getProviderById(1)).thenReturn(Optional.of(provider));
        doNothing().when(providerRepository).delete(1);

        // Act
        boolean isDeleted = providerService.delete(1);

        // Assert
        assertTrue(isDeleted);
        verify(providerRepository, times(1)).getProviderById(1);
        verify(providerRepository, times(1)).delete(1);
    }

    @Test
    public void testDeleteProviderNotFound() {
        // Arrange
        when(providerRepository.getProviderById(1)).thenReturn(Optional.empty());

        // Act
        boolean isDeleted = providerService.delete(1);

        // Assert
        assertFalse(isDeleted);
        verify(providerRepository, times(1)).getProviderById(1);
        verify(providerRepository, never()).delete(1);
    }
}