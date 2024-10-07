package com.project.backend.persistence.entity;

import jakarta.persistence.*;

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

    public DetalleVentaPK getId() {
        return id;
    }

    public void setId(DetalleVentaPK id) {
        this.id = id;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public Venta getVenta() {
        return venta;
    }

    public void setVenta(Venta venta) {
        this.venta = venta;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }
}
