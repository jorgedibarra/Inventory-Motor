package com.project.backend.domain.service;

import com.project.backend.domain.Order;
import com.project.backend.domain.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getAll() {
        return orderRepository.getAll();
    }

    public Optional<List<Order>> getByProvider(Integer providerId) {
        return orderRepository.getByProvider(providerId);
    }

    public Order save(Order order) {
        return orderRepository.save(order);
    }
}
