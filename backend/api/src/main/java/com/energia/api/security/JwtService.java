package com.energia.api.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

  @Value("${jwt.secret}")
  private String secretKey;

  @Value("${jwt.expiration}")
  private Long expiration;

  // metodo para obtener la clave de firma
  private Key getSignKey() {
    return Keys.hmacShaKeyFor(secretKey.getBytes());
  }

  // metodo para generar el token
  public String generateToken(String username) {
    Map<String, Object> claims = new HashMap<>();
    return createToken(claims, username);
  }

  // metodo para crear el token
  private String createToken(Map<String, Object> claims, String subject) {
    return Jwts.builder()
        .setClaims(claims)
        .setSubject(subject)
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + expiration))
        .signWith(getSignKey(), SignatureAlgorithm.HS256)
        .compact();
  }

  // metodo para extraer el nombre de usuario del token
  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  // metodo para extraer la fecha de expiracion del token
  public Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  // metodo para extraer un claim del token
  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  // metodo para extraer todos los claims del token
  private Claims extractAllClaims(String token) {
    return Jwts
        .parserBuilder()
        .setSigningKey(getSignKey())
        .build()
        .parseClaimsJws(token)
        .getBody();
  }

  // metodo para validar que el token sea valido
  public Boolean isTokenValid(String token, String username) {
    final String extractedUsername = extractUsername(token);
    return (extractedUsername.equals(username) && !isTokenExpired(token));
  }

  // metodo para validar que el token no este expirado
  private Boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
  }
}
