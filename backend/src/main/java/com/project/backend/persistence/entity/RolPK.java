package com.project.backend.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class RolPK implements Serializable {

    @Column(name = "nombre_usuario")
    private String nombreUsuario;

    private String rol;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RolPK rolPK = (RolPK) o;
        return Objects.equals(nombreUsuario, rolPK.nombreUsuario) && Objects.equals(rol, rolPK.rol);
    }

    @Override
    public int hashCode() {
        return Objects.hash(nombreUsuario, rol);
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}
