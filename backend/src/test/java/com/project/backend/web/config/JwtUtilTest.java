package com.project.backend.web.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    @Test
    public void testCreateJwt() {
        // Arrange
        String expectedUsername = "omar";
        JwtUtil jwtUtil = new JwtUtil();

        // Act
        String jwt = jwtUtil.create(expectedUsername);

        System.out.println(jwt);

        // Assert
        assertThat(jwt).isNotNull(); // Verifica que el token no sea nulo

        // Decodificar el token usando el mismo algoritmo y clave
        Algorithm algorithm = Algorithm.HMAC256("inventory_motor");
        JWTVerifier verifier = JWT.require(algorithm)
                .withIssuer("inventory-motor")
                .build();

        try {
            DecodedJWT decodedJWT = verifier.verify(jwt);
            String actualUsername = decodedJWT.getSubject();

            assertThat(actualUsername).isEqualTo(expectedUsername); // Verifica que el username sea correcto
            assertThat(decodedJWT.getIssuer()).isEqualTo("inventory-motor"); // Verifica el issuer

        } catch (JWTVerificationException e) {
            e.printStackTrace();
            assertThat(false).isTrue(); // Si hay una excepción, el test debería fallar
        }
    }
}