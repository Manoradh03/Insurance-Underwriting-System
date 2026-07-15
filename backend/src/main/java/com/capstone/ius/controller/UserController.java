package com.capstone.ius.controller;

import com.capstone.ius.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    @GetMapping("/me")
    public Map<String, Object> me(@AuthenticationPrincipal User u) {
        return Map.of(
            "id", u.getId(),
            "username", u.getUsername(),
            "email", u.getEmail(),
            "fullName", u.getFullName() == null ? "" : u.getFullName(),
            "phone", u.getPhone() == null ? "" : u.getPhone(),
            "role", u.getRole().name()
        );
    }
}
