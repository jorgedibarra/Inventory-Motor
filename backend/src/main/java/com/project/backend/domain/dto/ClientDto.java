package com.project.backend.domain.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClientDto {
    private Integer clientId;
    private String name;
    private String lastName;
    private Integer document;
    private String address;
    private Long phone;
    private String email;
    private Boolean state;
}
