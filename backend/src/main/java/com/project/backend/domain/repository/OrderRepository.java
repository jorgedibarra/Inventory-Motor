package com.project.backend.domain.repository;

import com.project.backend.domain.Order;

import java.util.List;
import java.util.Optional;

public interface OrderRepository {
    List<Order> getAll();
    Optional<List<Order>> getByProvider(Integer providerId);
    Order save(Order order);
}
