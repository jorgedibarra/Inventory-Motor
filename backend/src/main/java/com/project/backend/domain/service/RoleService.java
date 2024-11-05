package com.project.backend.domain.service;

import com.project.backend.domain.Role;
import com.project.backend.domain.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    public List<Role> getAll() {
        return roleRepository.getAll();
    }

    public Optional<Role> getRole(String username) {
        return roleRepository.getRole(username);
    }

    public Role save(Role role) {
        return roleRepository.save(role);
    }

    public Boolean delete(String roleId) {
        return getRole(roleId).map(role -> {
            roleRepository.delete(roleId);
            return true;
        }).orElse(false);
    }

    public Role update(Role role) {
        return roleRepository.update(role);
    }
}
