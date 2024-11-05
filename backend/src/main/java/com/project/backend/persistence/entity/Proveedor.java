package com.project.backend.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "proveedores")
public class Proveedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_proveedor")
    private Integer idProveedor;

    private String nombre;

    @Column(name = "numero_identificacion")
    private String numeroIdentificacion;

    private  String direccion;

    private Long celular;

    private String correo;

    private Boolean estado;

    @OneToMany(mappedBy = "proveedor")
    private List<Pedido> pedidos;


}
