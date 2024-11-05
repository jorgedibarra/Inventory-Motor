package com.project.backend.domain.service;

import com.project.backend.domain.Sale;
import com.project.backend.domain.repository.SaleRepository;
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
public class SaleServiceTest {

    @InjectMocks
    private SaleService saleService;

    @Mock
    private SaleRepository saleRepository;

    @Test
    public void testGetAllSales() {
        // Arrange
        List<Sale> mockSales = new ArrayList<>();
        mockSales.add(new Sale());

        when(saleRepository.getAll()).thenReturn(mockSales);

        // Act
        List<Sale> sales = saleService.getAll();

        // Assert
        assertFalse(sales.isEmpty());
        verify(saleRepository, times(1)).getAll();
    }

    @Test
    public void testGetSalesByClientFound() {
        // Arrange
        List<Sale> mockSales = new ArrayList<>();
        mockSales.add(new Sale());

        when(saleRepository.getByClient(1)).thenReturn(Optional.of(mockSales));

        // Act
        Optional<List<Sale>> foundSales = saleService.getByClient(1);

        // Assert
        assertTrue(foundSales.isPresent());
        assertFalse(foundSales.get().isEmpty());
        verify(saleRepository, times(1)).getByClient(1);
    }

    @Test
    public void testGetSalesByClientNotFound() {
        // Arrange
        when(saleRepository.getByClient(1)).thenReturn(Optional.empty());

        // Act
        Optional<List<Sale>> foundSales = saleService.getByClient(1);

        // Assert
        assertFalse(foundSales.isPresent());
        verify(saleRepository, times(1)).getByClient(1);
    }

    @Test
    public void testSaveSale() {
        // Arrange
        Sale sale = new Sale();
        sale.setSaleId(1);

        when(saleRepository.save(sale)).thenReturn(sale);

        // Act
        Sale savedSale = saleService.save(sale);

        // Assert
        assertNotNull(savedSale);
        assertEquals(1, savedSale.getSaleId());
        verify(saleRepository, times(1)).save(sale);
    }
}
