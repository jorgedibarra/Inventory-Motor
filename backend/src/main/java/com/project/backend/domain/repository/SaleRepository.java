package com.project.backend.domain.repository;

import com.project.backend.domain.Sale;

import java.util.List;
import java.util.Optional;

public interface SaleRepository {
    List<Sale> getAll();
    Optional<List<Sale>> getByClient(Integer clientId);
    Sale save(Sale sale);

}
