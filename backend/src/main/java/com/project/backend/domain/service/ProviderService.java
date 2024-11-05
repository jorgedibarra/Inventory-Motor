package com.project.backend.domain.service;

import com.project.backend.domain.Provider;
import com.project.backend.domain.repository.ProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProviderService {

    @Autowired
    private ProviderRepository providerRepository;

    public List<Provider> getAll() {
        return providerRepository.getAll();
    }

    public Optional<Provider> getProviderById(int providerId) {
        return providerRepository.getProviderById(providerId);
    }

    public Provider save(Provider provider) {
        return providerRepository.save(provider);
    }

    public boolean delete(int providerId) {
        return getProviderById(providerId).map(provider -> {
            providerRepository.delete(providerId);
            return true;
        }).orElse(false);
    }

    public Boolean changeState(Integer providerId) {
        Optional<Provider> provider = providerRepository.getProviderById(providerId);
        if (provider.isPresent()) {
            provider.get().setState(false);
            providerRepository.update(provider.get());
            return true;
        }
        return false;
    }
}
