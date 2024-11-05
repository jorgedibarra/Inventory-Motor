package com.project.backend.domain;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
public class Order {
    private Integer idOrder;
    private Integer idProvider;
    private LocalDateTime date;
    private Boolean state;
    private List<OrderItem> products;

}
