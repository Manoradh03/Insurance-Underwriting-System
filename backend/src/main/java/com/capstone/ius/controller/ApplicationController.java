package com.capstone.ius.controller;

import com.capstone.ius.dto.ApplicationRequest;
import com.capstone.ius.dto.DecisionResult;
import com.capstone.ius.entity.PolicyApplication;
import com.capstone.ius.entity.User;
import com.capstone.ius.service.ApplicationService;
import com.capstone.ius.underwriting.UnderwritingEngine;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ApplicationController {

    private final ApplicationService service;
    private final UnderwritingEngine engine;

    @PostMapping
    public PolicyApplication submit(@AuthenticationPrincipal User user,
                                    @RequestBody ApplicationRequest req) {
        return service.submit(user, req);
    }

    @GetMapping("/my")
    public List<PolicyApplication> myApps(@AuthenticationPrincipal User user) {

        System.out.println("Logged User ID = " + user.getId());
        System.out.println("Logged Username = " + user.getUsername());

        return service.myApplications(user);
    }

    @GetMapping("/{id}")
    public PolicyApplication one(@PathVariable Long id) {
        return service.getOne(id);
    }

    /** Live quote preview without saving. */
    @PostMapping("/quote")
    public DecisionResult quote(@RequestBody ApplicationRequest req) {
        PolicyApplication tmp = PolicyApplication.builder()
                .insuranceType(req.getInsuranceType())
                .insurancePlan(req.getInsurancePlan())
                .age(req.getAge())
                .gender(req.getGender())
                .occupation(req.getOccupation())

                .applicantName(req.getApplicantName())

                .nomineeName(req.getNomineeName())

                .nomineeRelationship(req.getNomineeRelationship())

                .nomineeAge(req.getNomineeAge())
                .annualIncome(req.getAnnualIncome())
                .coverageAmount(req.getCoverageAmount())
                .termYears(req.getTermYears())
                .smoker(req.getSmoker())
                .alcoholUser(req.getAlcoholUser())
                .preExistingDisease(req.getPreExistingDisease())
                .heightCm(req.getHeightCm())
                .weightKg(req.getWeightKg())
                .familyHistory(req.getFamilyHistory())
                .vehicleType(req.getVehicleType())
                .vehicleAge(req.getVehicleAge())
                .vehicleValue(req.getVehicleValue())
                .pastClaims(req.getPastClaims())
                .propertyType(req.getPropertyType())
                .propertyAge(req.getPropertyAge())
                .propertyValue(req.getPropertyValue())
                .propertyLocation(req.getPropertyLocation())
                .build();
        return engine.evaluate(tmp);
    }
}
