package com.project.backend.domain.repository;

import com.project.backend.domain.Provider;

import java.util.List;
import java.util.Optional;

public interface ProviderRepository {
    List<Provider> getAll();
    Optional<Provider> getProviderById(int providerId);
    Provider save(Provider provider);
    void delete(int providerId);
}
