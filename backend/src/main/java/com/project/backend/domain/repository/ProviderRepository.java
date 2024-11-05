package com.project.backend.domain.repository;

import com.project.backend.domain.Provider;

import java.util.List;
import java.util.Optional;

public interface ProviderRepository {
    List<Provider> getAll();
    Optional<Provider> getProviderById(Integer providerId);
    Provider save(Provider provider);
    void delete(Integer providerId);
    Provider update(Provider provider);
}
