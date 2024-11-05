package com.project.backend.domain.service;

import com.project.backend.domain.Order;
import com.project.backend.domain.repository.OrderRepository;
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
public class OrderServiceTest {

    @InjectMocks
    private OrderService orderService;

    @Mock
    private OrderRepository orderRepository;

    @Test
    public void testGetAllOrders() {
        // Arrange
        List<Order> mockOrders = new ArrayList<>();
        mockOrders.add(new Order());

        when(orderRepository.getAll()).thenReturn(mockOrders);

        // Act
        List<Order> orders = orderService.getAll();

        // Assert
        assertFalse(orders.isEmpty());
        verify(orderRepository, times(1)).getAll();
    }

    @Test
    public void testGetOrdersByProviderFound() {
        // Arrange
        List<Order> mockOrders = new ArrayList<>();
        mockOrders.add(new Order());

        when(orderRepository.getByProvider(1)).thenReturn(Optional.of(mockOrders));

        // Act
        Optional<List<Order>> foundOrders = orderService.getByProvider(1);

        // Assert
        assertTrue(foundOrders.isPresent());
        assertFalse(foundOrders.get().isEmpty());
        verify(orderRepository, times(1)).getByProvider(1);
    }

    @Test
    public void testGetOrdersByProviderNotFound() {
        // Arrange
        when(orderRepository.getByProvider(1)).thenReturn(Optional.empty());

        // Act
        Optional<List<Order>> foundOrders = orderService.getByProvider(1);

        // Assert
        assertFalse(foundOrders.isPresent());
        verify(orderRepository, times(1)).getByProvider(1);
    }

    @Test
    public void testSaveOrder() {
        // Arrange
        Order order = new Order();
        order.setIdOrder(1);

        when(orderRepository.save(order)).thenReturn(order);

        // Act
        Order savedOrder = orderService.save(order);

        // Assert
        assertNotNull(savedOrder);
        assertEquals(1, savedOrder.getIdOrder());
        verify(orderRepository, times(1)).save(order);
    }
}
