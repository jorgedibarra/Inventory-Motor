package com.project.backend.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "detalleventas")
public class DetalleVenta {

    @EmbeddedId
    private DetalleVentaPK id;

    private Integer cantidad;

    private Double total;

    @ManyToOne
    @MapsId("idVenta")
    @JoinColumn(name = "id_venta", insertable = false, updatable = false)
    private Venta venta;

    @ManyToOne
    @JoinColumn(name = "id_producto", insertable = false, updatable = false)
    private Producto producto;

}
