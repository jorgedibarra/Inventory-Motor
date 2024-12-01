package com.project.backend.web.controller;

import com.project.backend.domain.User;
import com.project.backend.domain.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAll() {
        return new ResponseEntity<>(userService.getAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable("id") String userId) {
        return userService.getUser(userId)
                .map(user -> new ResponseEntity<>(user, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/save")
    public ResponseEntity<User> save(@RequestBody User user) {
        return new ResponseEntity<>(userService.save(user), HttpStatus.CREATED);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable("id") String userId) {
        return userService.delete(userId)
                ? new ResponseEntity<>(true, HttpStatus.OK)
                : new ResponseEntity<>(false, HttpStatus.NOT_FOUND);
    }

    @PutMapping("/update")
    public ResponseEntity<User> update(User user){
        return new ResponseEntity<>(userService.update(user), HttpStatus.OK);
    }

    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file, @RequestParam("userId") String userId) {
        try {
            // Ruta donde guardarás las imágenes
            String uploadDir = "C:/inventory-motor/backend/src/main/resources/static/images"; // Cambia esto a la ruta de tu carpeta
            String fileName = file.getOriginalFilename();

            // Asegúrate de que la carpeta existe
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Guarda la imagen en la carpeta
            Path path = Paths.get(uploadDir + fileName);
            Files.write(path, file.getBytes());

            // Genera la URL de la imagen
            String imageUrl = "http://localhost:8099/images/" + fileName;

            // Guarda la URL en la base de datos asociada al usuario
            Optional<User> userOptional = userService.getUser(userId);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                user.setPhoto(imageUrl); // Actualiza el campo de la imagen
                userService.save(user); // Guarda el usuario actualizado
            } else {
                return new ResponseEntity<>("Usuario no encontrado", HttpStatus.NOT_FOUND);
            }

            return new ResponseEntity<>("Imagen subida: " + imageUrl, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Error al subir la imagen: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
