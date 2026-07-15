package com.capstone.ius.entity;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "policy_applications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PolicyApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InsuranceType insuranceType;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InsurancePlan insurancePlan;

    // Common
    private Integer age;
    private String gender;                // MALE / FEMALE / OTHER
    private String occupation;
    private String applicantName;

    private String nomineeName;

    private String nomineeRelationship;

    private Integer nomineeAge;
    private Double annualIncome;
    private Double coverageAmount;
    private Integer termYears;

    // Life
    private Boolean smoker;
    private Boolean alcoholUser;
    private String preExistingDisease;    // NONE / DIABETES / HYPERTENSION / HEART / CANCER

    // Health
    private Double heightCm;
    private Double weightKg;
    private Boolean familyHistory;

    // Motor
    private String vehicleType;           // TWO_WHEELER / CAR / COMMERCIAL
    private Integer vehicleAge;
    private Double vehicleValue;
    private Integer pastClaims;

    // Home
    private String propertyType;          // APARTMENT / INDEPENDENT / VILLA
    private Integer propertyAge;
    private Double propertyValue;
    private String propertyLocation;      // LOW_RISK / MEDIUM_RISK / HIGH_RISK

    // Underwriting result
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;

    private Integer riskScore;
    private String riskCategory;
    private Double premium;
    private String remarks;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
        if (status == null) status = ApplicationStatus.PENDING;
    }

    @PreUpdate
    public void preUpdate() { updatedAt = LocalDateTime.now(); }

    public enum InsuranceType { LIFE, HEALTH, MOTOR, HOME }
    public enum InsurancePlan {
        BASIC,
        STANDARD,
        PREMIUM
    }
    public enum ApplicationStatus { PENDING, APPROVED, REJECTED, REFERRED }
}
