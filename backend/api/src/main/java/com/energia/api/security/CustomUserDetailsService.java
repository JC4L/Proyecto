package com.energia.api.security;

import com.energia.api.modelo.User;
import com.energia.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

  private final UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

    return new org.springframework.security.core.userdetails.User(
        user.getUsername(),
        user.getPassword(),
        List.of(new SimpleGrantedAuthority("USER")) // sin roles por ahora
    );
  }
}
