package com.project.backend.domain.dto;

import com.project.backend.domain.Category;
import com.project.backend.domain.Provider;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDto {

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
}
