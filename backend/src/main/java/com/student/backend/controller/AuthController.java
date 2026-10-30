package com.student.backend.controller;

import com.student.backend.model.Admin;
import com.student.backend.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AdminRepository adminRepository;

    /**
     * POST /api/auth/login
     * Body: { "username": "...", "password": "..." }
     * Returns 200 on success, 401 on bad credentials.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username and password required"));
        }

        Optional<Admin> adminOpt = adminRepository.findByUsername(username.trim());

        if (adminOpt.isEmpty() || !adminOpt.get().getPassword().equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid username or password"));
        }

        return ResponseEntity.ok(Map.of(
            "message", "Login successful",
            "username", adminOpt.get().getUsername()
        ));
    }

    /**
     * POST /api/auth/register  (first-time setup — create admin)
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (username == null || password == null || username.isBlank() || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username and password required"));
        }
        if (adminRepository.findByUsername(username.trim()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Admin username already exists"));
        }

        Admin admin = new Admin(username.trim(), password);
        adminRepository.save(admin);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Admin created", "username", admin.getUsername()));
    }
}
