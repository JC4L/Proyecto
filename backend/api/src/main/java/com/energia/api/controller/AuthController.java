package com.energia.api.controller;

import com.energia.api.dto.user.DeleteRequest;
import com.energia.api.dto.user.LoginRequest;
import com.energia.api.dto.user.RegisterRequest;
import com.energia.api.dto.user.UpdateRequestDTO;
import com.energia.api.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        return userService.register(request);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        return userService.login(request);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(Authentication authentication, @Valid @RequestBody DeleteRequest request) {
        return userService.delete(authentication.getName(), request);
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(Authentication authentication, @Valid @RequestBody UpdateRequestDTO request) {
        return userService.update(authentication.getName(), request);
    }
}
