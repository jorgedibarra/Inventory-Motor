package com.project.backend.persistence;

import com.project.backend.domain.User;
import com.project.backend.domain.repository.UserRepository;
import com.project.backend.persistence.crud.UsuarioJpaRepository;
import com.project.backend.persistence.entity.Usuario;
import com.project.backend.persistence.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class UsuarioRepository  implements UserRepository {

    @Autowired
    private UsuarioJpaRepository usuarioJpaRepository;

    @Autowired
    private UserMapper mapper;

    @Override
    public List<User> getAll() {
        return mapper.toUsers((List<Usuario>) usuarioJpaRepository.findAll());
    }

    @Override
    public Optional<User> getUser(String userId) {
        return usuarioJpaRepository.findById(userId).map(usuario -> mapper.toUser(usuario));
    }

    @Override
    public User save(User user) {
        return mapper.toUser(usuarioJpaRepository.save(mapper.toUsuario(user)));
    }

    @Override
    public void delete(String userId) {
        usuarioJpaRepository.deleteById(userId);
    }

    @Override
    public User update(User user) {
        return mapper.toUser(usuarioJpaRepository.save(mapper.toUsuario(user)));
    }
}
