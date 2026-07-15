package com.capstone.ius.service;

import com.capstone.ius.dto.ApplicationRequest;
import com.capstone.ius.dto.DecisionResult;
import com.capstone.ius.entity.PolicyApplication;
import com.capstone.ius.entity.PolicyApplication.ApplicationStatus;
import com.capstone.ius.entity.User;
import com.capstone.ius.exception.ApiException;
import com.capstone.ius.repository.PolicyApplicationRepository;
import com.capstone.ius.underwriting.UnderwritingEngine;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final PolicyApplicationRepository repo;
    private final UnderwritingEngine engine;

    public PolicyApplication submit(User user, ApplicationRequest r) {
        if (r.getInsuranceType() == null)
            throw new ApiException(HttpStatus.BAD_REQUEST, "insuranceType is required");

        PolicyApplication app = PolicyApplication.builder()
                .user(user)
                .insuranceType(r.getInsuranceType())
                .insurancePlan(r.getInsurancePlan())
                .age(r.getAge())
                .gender(r.getGender())
                .occupation(r.getOccupation())
                .applicantName(r.getApplicantName())

                .nomineeName(r.getNomineeName())

                .nomineeRelationship(r.getNomineeRelationship())

                .nomineeAge(r.getNomineeAge())
                .annualIncome(r.getAnnualIncome())
                .coverageAmount(r.getCoverageAmount())
                .termYears(r.getTermYears())
                .smoker(r.getSmoker())
                .alcoholUser(r.getAlcoholUser())
                .preExistingDisease(r.getPreExistingDisease())
                .heightCm(r.getHeightCm())
                .weightKg(r.getWeightKg())
                .familyHistory(r.getFamilyHistory())
                .vehicleType(r.getVehicleType())
                .vehicleAge(r.getVehicleAge())
                .vehicleValue(r.getVehicleValue())
                .pastClaims(r.getPastClaims())
                .propertyType(r.getPropertyType())
                .propertyAge(r.getPropertyAge())
                .propertyValue(r.getPropertyValue())
                .propertyLocation(r.getPropertyLocation())
                .status(ApplicationStatus.PENDING)
                .build();

        DecisionResult d = engine.evaluate(app);
        app.setStatus(ApplicationStatus.valueOf(d.getStatus()));
        app.setRiskScore(d.getRiskScore());
        app.setRiskCategory(d.getRiskCategory());
        app.setPremium(d.getPremium());
        app.setRemarks(d.getRemarks());

        return repo.save(app);
    }

    public List<PolicyApplication> myApplications(User user) {

        return repo.findByUserIdOrderByCreatedAtDesc(user.getId());

    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<PolicyApplication> allApplications() {
        List<PolicyApplication> apps = repo.findAllByOrderByCreatedAtDesc();

        // Initialize lazy-loaded user
        apps.forEach(app -> app.getUser().getUsername());

        return apps;
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public PolicyApplication getOne(Long id) {

        PolicyApplication app = repo.findById(id)
                .orElseThrow(() ->
                        new ApiException(HttpStatus.NOT_FOUND,
                                "Application not found: " + id));

        // Initialize lazy-loaded user before returning
       

        return app;
    }

    public PolicyApplication updateDecision(Long id, String status, String remarks) {
        PolicyApplication a = getOne(id);
        try {
            a.setStatus(ApplicationStatus.valueOf(status.toUpperCase()));
        } catch (Exception e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid status");
        }
        if (remarks != null && !remarks.isBlank()) {
            a.setRemarks((a.getRemarks() == null ? "" : a.getRemarks() + " | ") + "Underwriter: " + remarks);
        }
        return repo.save(a);
    }
}
