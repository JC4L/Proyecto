package com.energia.api.service;

import com.energia.api.dto.user.AuthResponse;
import com.energia.api.dto.user.LoginRequest;
import com.energia.api.modelo.User;
import com.energia.api.repository.UserRepository;
import com.energia.api.security.JwtService;

import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    // para generar el token
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

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
        String token = jwtService.generateToken(user.getUsername());
        return ResponseEntity.ok().body(new AuthResponse(token));
    }

    public ResponseEntity<?> login(LoginRequest request) {
        Optional<User> maybeUser = userRepository.findByUsername(request.getUsername());
        if (maybeUser.isPresent()) {
            User user = maybeUser.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                String token = jwtService.generateToken(user.getUsername());
                return ResponseEntity.ok().body(new AuthResponse(token));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
    }
}
