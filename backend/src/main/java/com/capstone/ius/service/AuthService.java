package com.capstone.ius.service;

import com.capstone.ius.dto.AuthResponse;
import com.capstone.ius.dto.LoginRequest;
import com.capstone.ius.dto.RegisterRequest;
import com.capstone.ius.entity.User;
import com.capstone.ius.exception.ApiException;
import com.capstone.ius.repository.UserRepository;
import com.capstone.ius.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername()))
            throw new ApiException(HttpStatus.BAD_REQUEST, "Username already taken");
        if (userRepository.existsByEmail(req.getEmail()))
            throw new ApiException(HttpStatus.BAD_REQUEST, "Email already registered");

        User.Role role = User.Role.CUSTOMER;
        if (req.getRole() != null && !req.getRole().isBlank()) {
            try { role = User.Role.valueOf(req.getRole().toUpperCase()); }
            catch (IllegalArgumentException ignored) {}
        }

        User user = User.builder()
                .username(req.getUsername())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName())
                .phone(req.getPhone())
                .role(role)
                .build();
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token, user.getUsername(), user.getRole().name(), user.getFullName());
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword()))
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid credentials");

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token, user.getUsername(), user.getRole().name(), user.getFullName());
    }
}
