package com.project.backend.domain;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class Client {
    private Integer clientId;
    private String name;
    private String lastName;
    private Integer document;
    private String address;
    private Long phone;
    private String email;
    private Boolean state;
    private List<Sale> sales;

}
