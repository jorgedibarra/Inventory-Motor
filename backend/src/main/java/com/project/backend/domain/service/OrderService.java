package com.project.backend.domain.service;

import com.project.backend.domain.Order;
import com.project.backend.domain.OrderItem;
import com.project.backend.domain.Product;
import com.project.backend.domain.repository.OrderRepository;
import com.project.backend.domain.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Order> getAll() {
        return orderRepository.getAll();
    }

    public Optional<List<Order>> getByProvider(Integer providerId) {
        return orderRepository.getByProvider(providerId);
    }

    public Optional<Order> getOrder(Integer providerId) {
        return orderRepository.getOrder(providerId);
    }

    @Transactional
    public Order save(Order order) {
        //Guardar el pedido
        Order savedOrder = orderRepository.save(order);

        // Iterar sobre los detalles del pedido y actualizar el stock de cada producto
        for (OrderItem item: order.getProducts()) {
            Product product = productRepository.getProductById(item.getProductId())
                                                .orElseThrow(() -> new RuntimeException("Product not found"));

            // Actualizar el stock del producto sumando la cantidad del detalle del pedido
            product.setStock(product.getStock() + item.getQuantity());

            // Guardar el producto actualizado
            productRepository.save(product);
        }
        return savedOrder;
    }

    public Boolean changeState( Integer active) {
        Optional<Order> order = orderRepository.getOrder(active);
        if (order.isPresent()) {
            order.get().setState(false);
            orderRepository.save(order.get());
            return true;
        }
        return false;
    }
}
