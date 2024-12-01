class Producto {
    constructor(id, nombreProducto, descripcionProducto, categoProducto, proveedorProducto, precioVentaProducto, precioCompraProducto, ivaProducto, cantidadProducto, fotoProducto, estadoProducto) {
      this._id = id;
      this.nombreProducto = nombreProducto;
      this.descripcionProducto = descripcionProducto;
      this.categoProducto = categoProducto;
      this.proveedorProducto = proveedorProducto;
      this.precioVentaProducto = precioVentaProducto;
      this.precioCompraProducto = precioCompraProducto;
      this.cantidadProducto = cantidadProducto;
      this.ivaProducto = ivaProducto;
      this.fotoProducto = fotoProducto;
      this.estadoProducto = estadoProducto;
    }
  }
  
  export default Producto;
  