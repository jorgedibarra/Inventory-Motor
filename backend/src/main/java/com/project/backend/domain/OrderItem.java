package com.project.backend.domain;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class OrderItem {
    private Integer productId;
    private Integer quantity;
    private Double total;

}
