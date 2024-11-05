package com.project.backend.persistence.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "clientes")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Integer idCliente;

    @Column(name = "nombres")
    private String nombre;

    @Column(name = "apellidos")
    private String apellido;

    private Integer cedula;

    private String direccion;

    private Long celular;

    private String correo;

    private Boolean estado;

    @OneToMany(mappedBy = "cliente", cascade = {CascadeType.ALL})
    private List<Venta> ventas;

}
