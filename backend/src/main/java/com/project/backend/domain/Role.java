package com.project.backend.domain;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Role {
    private String username;
    private String role;
    private User user;

}
