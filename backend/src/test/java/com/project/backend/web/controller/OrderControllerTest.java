package com.project.backend.web.controller;

import com.project.backend.domain.Order;
import com.project.backend.domain.service.OrderService;
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
public class OrderControllerTest {

    @InjectMocks
    private OrderController orderController;

    @Mock
    private OrderService orderService;

    @Test
    public void testGetAllOrders() {
        // Arrange
        List<Order> mockOrders = new ArrayList<>();
        mockOrders.add(new Order());

        when(orderService.getAll()).thenReturn(mockOrders);

        // Act
        ResponseEntity<List<Order>> response = orderController.getAll();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertFalse(response.getBody().isEmpty());
        verify(orderService, times(1)).getAll();
    }

    @Test
    public void testGetOrdersByProviderFound() {
        // Arrange
        List<Order> mockOrders = new ArrayList<>();
        mockOrders.add(new Order());

        when(orderService.getByProvider(1)).thenReturn(Optional.of(mockOrders));

        // Act
        ResponseEntity<List<Order>> response = orderController.getByProvider(1);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertFalse(response.getBody().isEmpty());
        verify(orderService, times(1)).getByProvider(1);
    }

    @Test
    public void testGetOrdersByProviderNotFound() {
        // Arrange
        when(orderService.getByProvider(1)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<List<Order>> response = orderController.getByProvider(1);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(orderService, times(1)).getByProvider(1);
    }

    @Test
    public void testSaveOrder() {
        // Arrange
        Order order = new Order();
        order.setIdOrder(1);

        when(orderService.save(order)).thenReturn(order);

        // Act
        ResponseEntity<Order> response = orderController.save(order);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(1, response.getBody().getIdOrder());
        verify(orderService, times(1)).save(order);
    }
}
