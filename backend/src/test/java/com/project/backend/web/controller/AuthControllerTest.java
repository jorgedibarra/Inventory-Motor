package com.project.backend.web.controller;

import com.project.backend.domain.dto.LoginDto;
import com.project.backend.web.config.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthController authController;

    @Test
    public void testLoginSuccess() {
        // Arrange
        String username = "testuser";
        String password = "testpassword";
        String token = "mocked-jwt-token";

        LoginDto loginDto = new LoginDto(username, password);
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, password);

        Authentication authentication = mock(Authentication.class);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authenticationManager.authenticate(authenticationToken)).thenReturn(authentication);
        when(jwtUtil.create(username)).thenReturn(token);

        // Act
        ResponseEntity<Void> response = authController.login(loginDto);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getHeaders().get(HttpHeaders.AUTHORIZATION));
        assertEquals(token, response.getHeaders().get(HttpHeaders.AUTHORIZATION).get(0));

        verify(authenticationManager, times(1)).authenticate(authenticationToken);
        verify(jwtUtil, times(1)).create(username);
    }

    @Test
    public void testLoginFailure() {
        // Arrange
        String username = "testuser";
        String password = "wrongpassword";

        LoginDto loginDto = new LoginDto(username, password);
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, password);

        when(authenticationManager.authenticate(authenticationToken)).thenThrow(new RuntimeException("Authentication failed"));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            authController.login(loginDto);
        });

        verify(authenticationManager, times(1)).authenticate(authenticationToken);
        verify(jwtUtil, times(0)).create(username);
    }
}
