package com.energia.api.service;

import com.energia.api.dto.user.AuthResponse;
import com.energia.api.dto.user.DeleteRequest;
import com.energia.api.dto.user.LoginRequest;
import com.energia.api.dto.user.MessageResponse;
import com.energia.api.dto.user.RegisterRequest;
import com.energia.api.dto.user.UpdateRequestDTO;
import com.energia.api.modelo.User;
import com.energia.api.repository.UserRepository;
import com.energia.api.security.JwtService;

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
    // para generar el token
    private final JwtService jwtService;

    public ResponseEntity<?> register(RegisterRequest request) {
        // validar que todos los campos sean obligatorios
        if (request == null ||
                request.getUsername() == null ||
                request.getPassword() == null ||
                request.getEmail() == null ||
                request.getUsername().isEmpty() ||
                request.getPassword().isEmpty() ||
                request.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Todos los campos son obligatorios"));
        }
        // validar que el usuario no exista
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("El usuario ya existe"));
        }
        // validar que el email no exista
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("El email ya existe"));
        }

        // construir el User desde el DTO y encriptar la contraseña
        User user = User.builder()
                .username(request.getUsername().trim().toLowerCase())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        userRepository.save(user);
        String token = jwtService.generateToken(user.getUsername());
        return ResponseEntity.ok().body(new AuthResponse(token));
    }

    public ResponseEntity<?> login(LoginRequest request) {
        Optional<User> maybeUser = userRepository.findByUsername(request.getUsername().trim().toLowerCase());
        if (maybeUser.isPresent()) {
            User user = maybeUser.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                String token = jwtService.generateToken(user.getUsername());
                return ResponseEntity.ok().body(new AuthResponse(token));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Credenciales inválidas"));
    }

    public ResponseEntity<?> delete(String username, DeleteRequest request) {
        Optional<User> maybeUser = userRepository.findByUsername(username);
        if (maybeUser.isPresent()) {
            User user = maybeUser.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                userRepository.delete(user);
                return ResponseEntity.ok().body(new MessageResponse("Usuario eliminado correctamente"));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Credenciales inválidas"));
    }

    public ResponseEntity<?> update(String username, UpdateRequestDTO request) {
        Optional<User> maybeUser = userRepository.findByUsername(username);
        Boolean needToken = false;
        if (maybeUser.isPresent() && passwordEncoder.matches(request.getPassword(), maybeUser.get().getPassword())) {
            User user = maybeUser.get();
            if (request.getNewUsername() != null && !request.getNewUsername().isEmpty()) {
                if (userRepository.existsByUsername(request.getNewUsername().trim().toLowerCase())) {
                    return ResponseEntity.badRequest().body(new MessageResponse("El nombre de usuario ya existe"));
                }
                user.setUsername(request.getNewUsername().trim().toLowerCase());
                needToken = true;
            }
            if (request.getNewEmail() != null && !request.getNewEmail().isEmpty()) {
                if (userRepository.existsByEmail(request.getNewEmail())) {
                    return ResponseEntity.badRequest().body(new MessageResponse("El email ya existe"));
                }
                user.setEmail(request.getNewEmail());
            }
            if (request.getNewPassword() != null) {
                user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            }
            userRepository.save(user);
            if (needToken) {
                String token = jwtService.generateToken(user.getUsername());
                return ResponseEntity.ok().body(new AuthResponse(token));
            }
            return ResponseEntity.ok().body(new MessageResponse("Usuario actualizado correctamente"));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Credenciales inválidas"));
    }
}
