package com.project.backend.domain.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class AuthResponseDto {
    private String token;
    private String username;
    private String profilePicture; // URL de la foto de perfil
    private List<String> roles; // Roles del usuario

    // Constructor, getters y setters
    public AuthResponseDto(String token, String username, String profilePicture, List<String> roles) {
        this.token = token;
        this.username = username;
        this.profilePicture = profilePicture;
        this.roles = roles;
    }

}

