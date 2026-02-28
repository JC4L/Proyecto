package com.energia.api.service;

import com.energia.api.modelo.User;
import com.energia.api.dto.LoginRequest;
import com.energia.api.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ResponseEntity<?> register(User user) {
        // validar que todos los campos sean obligatorios
        if (user == null ||
                user.getUsername() == null ||
                user.getPassword() == null ||
                user.getEmail() == null ||
                user.getUsername().isEmpty() ||
                user.getPassword().isEmpty() ||
                user.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body("Todos los campos son obligatorios");
        }
        // validar que el usuario no exista
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("El usuario ya existe");
        }
        // validar que el email no exista
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("El email ya existe");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok().body("Usuario registrado exitosamente");
    }

    public ResponseEntity<?> login(LoginRequest request) {
        Optional<User> maybeUser = userRepository.findByUsername(request.getUsername());
        if (maybeUser.isPresent()) {
            User user = maybeUser.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return ResponseEntity.ok().body("Login successful");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
    }
}
