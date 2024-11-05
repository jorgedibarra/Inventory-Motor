package com.project.backend.domain;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Product {
    private int productId;
    private String name;
    private String description;
    private int categoryId;
    private int providerId;
    private double priceSale;
    private double priceBuy;
    private double vat;
    private int stock;
    private String image;
    private boolean state;
    private Category category;
    private Provider provider;

}
