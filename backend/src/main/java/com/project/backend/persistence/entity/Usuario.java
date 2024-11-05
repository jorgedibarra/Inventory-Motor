package com.project.backend.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    private String nombre;

    private String correo;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @Column(name = "clave")
    private String contrasena;

    private String foto;

    private Boolean estado;

    @OneToMany(mappedBy = "usuario", fetch = FetchType.EAGER)
    private List<Rol> roles;

}
