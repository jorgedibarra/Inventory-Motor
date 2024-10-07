package com.project.backend.persistence;

import com.project.backend.domain.Sale;
import com.project.backend.domain.repository.SaleRepository;
import com.project.backend.persistence.crud.VentaJpaRepository;
import com.project.backend.persistence.entity.Venta;
import com.project.backend.persistence.mapper.SaleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class VentaRepository implements SaleRepository {

    @Autowired
    private VentaJpaRepository ventaJpaRepository;

    @Autowired
    private SaleMapper mapper;

    @Override
    public List<Sale> getAll() {
        return mapper.toSales((List<Venta>) ventaJpaRepository.findAll());
    }

    @Override
    public Optional<List<Sale>> getByClient(Integer clientId) {
        return ventaJpaRepository.findByIdCliente(clientId)
                .map(ventas -> mapper.toSales(ventas));
    }

    @Override
    public Sale save(Sale sale) {
        Venta venta = mapper.toVenta(sale);
        venta.getProductos().forEach(producto -> producto.setVenta(venta));
        return mapper.toSale(ventaJpaRepository.save(venta));
    }
}
