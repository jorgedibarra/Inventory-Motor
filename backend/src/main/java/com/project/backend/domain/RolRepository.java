package com.project.backend.domain;

import com.project.backend.domain.repository.RoleRepository;
import com.project.backend.persistence.crud.RolJpaRepository;
import com.project.backend.persistence.entity.Rol;
import com.project.backend.persistence.mapper.RoleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class RolRepository implements RoleRepository {

    @Autowired
    private RolJpaRepository rolJpaRepository;

    @Autowired
    private RoleMapper mapper;

    @Override
    public List<Role> getAll() {
        return mapper.toRoles((List<Rol>) rolJpaRepository.findAll());
    }

    @Override
    public Optional<Role> getRole(String username) {
        return rolJpaRepository.findById(username).map(rol -> mapper.toRole(rol));
    }

    @Override
    public Role save(Role role) {
        return mapper.toRole(rolJpaRepository.save(mapper.toRol(role)));
    }

    @Override
    public void delete(String roleId) {
        rolJpaRepository.deleteById(roleId);
    }

    @Override
    public Role update(Role role) {
        return mapper.toRole(rolJpaRepository.save(mapper.toRol(role)));
    }
}
