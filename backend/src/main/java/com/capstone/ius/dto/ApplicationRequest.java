package com.capstone.ius.dto;

import com.capstone.ius.entity.PolicyApplication.InsuranceType;
import com.capstone.ius.entity.PolicyApplication.InsurancePlan;
import lombok.Data;

@Data
public class ApplicationRequest {
    private InsuranceType insuranceType;
    private InsurancePlan insurancePlan;

    private Integer age;
    private String gender;
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
    private String preExistingDisease;

    // Health
    private Double heightCm;
    private Double weightKg;
    private Boolean familyHistory;

    // Motor
    private String vehicleType;
    private Integer vehicleAge;
    private Double vehicleValue;
    private Integer pastClaims;

    // Home
    private String propertyType;
    private Integer propertyAge;
    private Double propertyValue;
    private String propertyLocation;
}
