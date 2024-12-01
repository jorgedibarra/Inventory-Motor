package com.project.backend.domain.service;

import com.project.backend.domain.Product;
import com.project.backend.domain.Sale;
import com.project.backend.domain.SaleItem;
import com.project.backend.domain.repository.ProductRepository;
import com.project.backend.domain.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class SaleService {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Sale> getAll() {
        return saleRepository.getAll();
    }

    public Optional<Sale> getSale(Integer saleId) {
        return saleRepository.getSale(saleId);
    }

    public Optional<List<Sale>> getByClient(Integer clientId) {
        return saleRepository.getByClient(clientId);
    }

    @Transactional
    public Sale save(Sale sale) {
        // Si es una actualización
        if (sale.getSaleId() != null) {
            Sale existingSale = saleRepository.getSale(sale.getSaleId())
                    .orElseThrow(() -> new RuntimeException("Sale not found"));

            // Devolver el stock de los productos de la venta existente
            for (SaleItem existingItem : existingSale.getItems()) {
                Product product = productRepository.getProductById(existingItem.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found"));
                product.setStock(product.getStock() + existingItem.getQuantity()); // Devolver stock
                productRepository.save(product);
            }

            // Actualizar los detalles de la venta
            updateSaleItems(existingSale, sale);
        }

        // Guardar la venta
        Sale savedSale = saleRepository.save(sale);

        // Ajustar el stock de los productos con las nuevas cantidades
        for (SaleItem item : sale.getItems()) {
            Product product = productRepository.getProductById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            // Validar que haya suficiente stock
            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getProductId());
            }

            // Reducir el stock
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        }

        return savedSale;
    }

    /**
     * Método para actualizar los detalles de la venta (SaleItems).
     */
    private void updateSaleItems(Sale existingSale, Sale newSale) {
        // Mapear los detalles actuales por ID para facilitar la comparación
        Map<Integer, SaleItem> existingItemsMap = existingSale.getItems().stream()
                .collect(Collectors.toMap(SaleItem::getProductId, Function.identity()));

        // Procesar los nuevos detalles
        for (SaleItem newItem : newSale.getItems()) {
            SaleItem existingItem = existingItemsMap.get(newItem.getProductId());

            if (existingItem != null) {
                // Si el detalle ya existe, actualizar la cantidad
                existingItem.setQuantity(newItem.getQuantity());
                existingItem.setTotal(newItem.getTotal());
            } else {
                // Si es un nuevo detalle, agregarlo
                existingSale.getItems().add(newItem);
            }

            // Remover el detalle procesado del mapa
            existingItemsMap.remove(newItem.getProductId());
        }

        // Los detalles restantes en el mapa deben eliminarse
        for (SaleItem removedItem : existingItemsMap.values()) {
            existingSale.getItems().remove(removedItem);
        }
    }

    public Boolean changeState(Integer saleId) {
        Optional<Sale> sale = saleRepository.getSale(saleId);
        if (sale.isPresent()) {
            sale.get().setState(false);
            saleRepository.save(sale.get());
            return true;
        }
        return false;
    }
}
