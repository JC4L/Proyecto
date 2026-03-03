package com.energia.api.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateRequestDTO {
  @Size(min = 3, max = 20, message = "El nombre de usuario debe tener entre 3 y 20 caracteres")
  private String newUsername;
  @Email(message = "El email no es válido")
  private String newEmail;
  @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
  private String newPassword;

  @NotBlank(message = "La contraseña es obligatoria")
  private String password;
}
