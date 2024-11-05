package com.project.backend.web.controller;

import com.project.backend.domain.Sale;
import com.project.backend.domain.service.SaleService;
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
public class SaleControllerTest {

    @InjectMocks
    private SaleController saleController;

    @Mock
    private SaleService saleService;

    @Test
    public void testGetAllSales() {
        // Arrange
        List<Sale> mockSales = new ArrayList<>();
        mockSales.add(new Sale());

        when(saleService.getAll()).thenReturn(mockSales);

        // Act
        ResponseEntity<List<Sale>> response = saleController.getAll();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertFalse(response.getBody().isEmpty());
        verify(saleService, times(1)).getAll();
    }

    @Test
    public void testGetSalesByClientFound() {
        // Arrange
        List<Sale> mockSales = new ArrayList<>();
        mockSales.add(new Sale());

        when(saleService.getByClient(1)).thenReturn(Optional.of(mockSales));

        // Act
        ResponseEntity<List<Sale>> response = saleController.getByClient(1);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertFalse(response.getBody().isEmpty());
        verify(saleService, times(1)).getByClient(1);
    }

    @Test
    public void testGetSalesByClientNotFound() {
        // Arrange
        when(saleService.getByClient(1)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<List<Sale>> response = saleController.getByClient(1);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(saleService, times(1)).getByClient(1);
    }

    @Test
    public void testSaveSale() {
        // Arrange
        Sale sale = new Sale();
        sale.setSaleId(1);

        when(saleService.save(sale)).thenReturn(sale);

        // Act
        ResponseEntity<Sale> response = saleController.save(sale);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(1, response.getBody().getSaleId());
        verify(saleService, times(1)).save(sale);
    }
}
