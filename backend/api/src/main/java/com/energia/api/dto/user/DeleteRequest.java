package com.energia.api.dto.user;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class DeleteRequest {
  @NotBlank(message = "La contraseña es obligatoria")
  @NotNull(message = "La contraseña es obligatoria")
  private String password;
}
