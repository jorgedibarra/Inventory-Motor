package com.project.backend.persistence;

import com.project.backend.domain.Sale;
import com.project.backend.domain.repository.SaleRepository;
import com.project.backend.persistence.crud.DetalleVentaJpaRepository;
import com.project.backend.persistence.crud.VentaJpaRepository;
import com.project.backend.persistence.entity.Venta;
import com.project.backend.persistence.mapper.SaleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public class VentaRepository implements SaleRepository {

    @Autowired
    private VentaJpaRepository ventaJpaRepository;

    @Autowired
    private SaleMapper mapper;

    @Autowired
    private DetalleVentaJpaRepository detalleVentaJpaRepository;

    @Override
    public List<Sale> getAll() {
        return mapper.toSales(ventaJpaRepository.findByEstadoTrue());
    }

    @Override
    public Optional<List<Sale>> getByClient(Integer clientId) {
        return ventaJpaRepository.findByIdCliente(clientId)
                .map(ventas -> mapper.toSales(ventas));
    }

    @Override
    public Optional<Sale> getSale(Integer saleId) {
        return ventaJpaRepository.findByIdVentaAndEstadoTrue(saleId)
                .map(venta -> mapper.toSale(venta));
    }

    @Override
    @Transactional
    public Sale save(Sale sale) {
        Venta venta = mapper.toVenta(sale);

        // Si es una actualización, primero limpiar los detalles existentes
        if (venta.getIdVenta() != null) {
            Venta existingVenta = ventaJpaRepository.findById(venta.getIdVenta())
                    .orElseThrow(() -> new RuntimeException("Venta not found"));
            existingVenta.getProductos().clear();
            ventaJpaRepository.save(existingVenta);
        }

        // Establecer la relación bidireccional
        venta.getProductos().forEach(producto -> producto.setVenta(venta));

        return mapper.toSale(ventaJpaRepository.save(venta));


    }

    @Override
    public Sale update(Sale sale) {
        return save(sale);
    }
}
