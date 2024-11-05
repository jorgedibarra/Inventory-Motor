package com.project.backend.persistence;

import com.project.backend.domain.Provider;
import com.project.backend.domain.repository.ProviderRepository;
import com.project.backend.persistence.crud.ProveedorJpaRepository;
import com.project.backend.persistence.entity.Proveedor;
import com.project.backend.persistence.mapper.ProviderMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ProveedorRepository implements ProviderRepository {

    @Autowired
    private ProveedorJpaRepository proveedorJpaRepository;

    @Autowired
    private ProviderMapper providerMapper;

    @Override
    public List<Provider> getAll() {
        return providerMapper.toProviders(proveedorJpaRepository.findByEstadoTrue());
    }

    @Override
    public Optional<Provider> getProviderById(Integer providerId) {
        return proveedorJpaRepository.findByIdProveedorAndEstadoTrue(providerId).map(proveedor -> providerMapper.toProvider(proveedor));
    }

    @Override
    public Provider save(Provider provider) {
        Proveedor proveedor = providerMapper.toProveedor(provider);
        return providerMapper.toProvider(proveedorJpaRepository.save(proveedor));
    }

    @Override
    public void delete(Integer providerId) {
        proveedorJpaRepository.deleteById(providerId);
    }

    @Override
    public Provider update(Provider provider) {
        Proveedor proveedor = providerMapper.toProveedor(provider);
        return providerMapper.toProvider(proveedorJpaRepository.save(proveedor));
    }
}
