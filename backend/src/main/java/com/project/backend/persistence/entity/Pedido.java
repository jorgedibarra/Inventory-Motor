package com.project.backend.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido")
    private Integer idPedido;

    @Column(name = "id_proveedor")
    private Integer idProveedor;

    private LocalDateTime fecha;

    private Boolean estado;

    @ManyToOne
    @JoinColumn(name = "id_proveedor", insertable = false, updatable = false)
    private Proveedor proveedor;

    @OneToMany(mappedBy = "pedido", cascade = {CascadeType.ALL}, orphanRemoval = true)
    private List<DetallePedido> productos;

}
