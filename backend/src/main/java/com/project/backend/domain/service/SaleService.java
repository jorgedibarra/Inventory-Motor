package com.project.backend.domain.service;

import com.project.backend.domain.Product;
import com.project.backend.domain.Sale;
import com.project.backend.domain.SaleItem;
import com.project.backend.domain.repository.ProductRepository;
import com.project.backend.domain.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SaleService {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Sale> getAll() {
        return saleRepository.getAll();
    }

    public Optional<List<Sale>> getByClient(Integer clientId) {
        return saleRepository.getByClient(clientId);
    }

    public Sale save(Sale sale) {
        // Guardar la venta
        Sale savedSale = saleRepository.save(sale);

        //iterar sobre los detalles de la venta y actualizar el stock de cada producto
        for (SaleItem item: sale.getItems()) {
            Product product = productRepository.getProductById(item.getProductId())
                                                .orElseThrow(() -> new RuntimeException("Product not found"));

            // Actualizar el stock del producto restando la cantidad del detalle de la venta
            product.setStock(product.getStock() - item.getQuantity());

            // Guardar el producto actualizado
            productRepository.save(product);
        }
        return savedSale;
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
