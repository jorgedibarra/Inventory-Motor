package com.project.backend.domain;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
public class User {
    private String name;
    private String email;
    private LocalDateTime createdDate;
    private String password;
    private String photo;
    private Boolean state;
    private List<Role> roles;

}
