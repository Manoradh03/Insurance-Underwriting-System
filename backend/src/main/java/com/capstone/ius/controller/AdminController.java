package com.capstone.ius.controller;

import com.capstone.ius.entity.PolicyApplication;
import com.capstone.ius.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final ApplicationService service;

    @GetMapping("/applications")
    public List<PolicyApplication> all() { return service.allApplications(); }

    @PutMapping("/applications/{id}/decision")
    public PolicyApplication decide(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return service.updateDecision(id, body.getOrDefault("status", "PENDING"), body.get("remarks"));
    }
}
