package com.project.backend.domain;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
public class Sale {
    private Integer saleId;
    private Integer clientId;
    private LocalDateTime date;
    private String paymentMethod;
    private Boolean state;
    private List<SaleItem> items;
}
