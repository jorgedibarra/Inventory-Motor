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
        List<Proveedor> proveedores = (List<Proveedor>) proveedorJpaRepository.findAll();
        return providerMapper.toProviders(proveedores);
    }

    @Override
    public Optional<Provider> getProviderById(int providerId) {
        return proveedorJpaRepository.findById(providerId).map(proveedor -> providerMapper.toProvider(proveedor));
    }

    @Override
    public Provider save(Provider provider) {
        Proveedor proveedor = providerMapper.toProveedor(provider);
        return providerMapper.toProvider(proveedorJpaRepository.save(proveedor));
    }

    @Override
    public void delete(int providerId) {
        proveedorJpaRepository.deleteById(providerId);
    }
}
