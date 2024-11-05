package com.project.backend.domain.repository;

import com.project.backend.domain.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository {
    List<User> getAll();
    Optional<User> getUser(String userId);
    User save(User user);
    void delete(String user);
    User update(User user);
}
