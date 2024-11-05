package com.project.backend.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Provider {
    private int id;
    private String name;
    private String identificationDocument;
    private String address;
    private Long phone;
    private String email;
    private Boolean state;

}
