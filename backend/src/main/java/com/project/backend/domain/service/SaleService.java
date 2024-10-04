package com.project.backend.domain.service;

import com.project.backend.domain.Sale;
import com.project.backend.domain.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SaleService {

    @Autowired
    private SaleRepository saleRepository;

    public List<Sale> getAll() {
        return saleRepository.getAll();
    }

    public Optional<List<Sale>> getByClient(Integer clientId) {
        return saleRepository.getByClient(clientId);
    }

    public Sale save(Sale sale) {
        return saleRepository.save(sale);
    }
}
