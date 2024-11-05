package com.project.backend.domain.repository;

import com.project.backend.domain.Role;


import java.util.List;
import java.util.Optional;

public interface RoleRepository {
    List<Role> getAll();
    Optional<Role> getRole(String username);
    Role save(Role role);
    void delete(String roleId);
    Role update(Role role);
}
