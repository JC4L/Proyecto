package com.energia.api.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

  @NotBlank(message = "El nombre de usuario es requerido")
  @Size(min = 3, max = 50, message = "El usuario debe tener entre 3 y 50 caracteres")
  private String username;

  @NotBlank(message = "El correo electrónico es requerido")
  @Email(message = "El correo electrónico no tiene un formato válido")
  private String email;

  @NotBlank(message = "La contraseña es requerida")
  @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
  private String password;
}
