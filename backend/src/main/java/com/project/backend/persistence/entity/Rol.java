package com.project.backend.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class Rol {

    @EmbeddedId
    private RolPK id;

    @ManyToOne
    @JoinColumn(name = "nombre_usuario", referencedColumnName = "nombre", insertable = false, updatable = false)
    private Usuario usuario;

    public RolPK getId() {
        return id;
    }

    public void setId(RolPK id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
