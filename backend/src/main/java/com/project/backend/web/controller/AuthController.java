package com.project.backend.web.controller;

import com.project.backend.domain.User;
import com.project.backend.domain.dto.LoginDto;
import com.project.backend.persistence.UsuarioRepository;
import com.project.backend.web.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }



    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto){
        try {
            // Autenticación
            UsernamePasswordAuthenticationToken login =
                    new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword());

            // Generar token
            String jwt = this.jwtUtil.create(loginDto.getUsername());

            // Buscar el usuario en la base de datos
            User usuario = usuarioRepository.getUser(loginDto.getUsername())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Crear un DTO para la respuesta
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("token", jwt);
            responseBody.put("id", usuario.getName());
            responseBody.put("role", usuario.getRoles().get(0)); // Asume que tienes un objeto Role
            responseBody.put("imagenPerfil", usuario.getPhoto()); // Si tienes imagen de perfil

            return ResponseEntity.ok(responseBody);
        } catch (AuthenticationException e) {
            // Manejo de errores de autenticación
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Credenciales inválidas");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        } catch (Exception e) {
            // Manejo de otros errores
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error en el inicio de sesión");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
