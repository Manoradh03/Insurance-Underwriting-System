package com.capstone.ius.underwriting;

import com.capstone.ius.dto.DecisionResult;
import com.capstone.ius.entity.PolicyApplication;
import org.springframework.stereotype.Component;

/**
 * Simple rules-based underwriting engine.
 * Scores risk 0-100, then decides APPROVED / REFERRED / REJECTED
 * and calculates premium based on coverage, term and risk.
 */
@Component
public class UnderwritingEngine {

    public DecisionResult evaluate(PolicyApplication app) {
        int score = 0;
        StringBuilder notes = new StringBuilder();

        Integer age = app.getAge();
        if (age != null) {
            if (age < 18)      { score += 60; notes.append("Underage; "); }
            else if (age > 65) { score += 40; notes.append("Senior age; "); }
            else if (age > 50) { score += 20; notes.append("Age 50+; "); }
            else if (age > 35) { score += 10; }
        }

        score += switch (app.getInsuranceType()) {
            case LIFE   -> scoreLife(app, notes);
            case HEALTH -> scoreHealth(app, notes);
            case MOTOR  -> scoreMotor(app, notes);
            case HOME   -> scoreHome(app, notes);
        };

        if (score > 100) score = 100;
        if (score < 0)   score = 0;

        String category;
        String status;
        if (score <= 30) {

            category = "LOW";
            status = "APPROVED";

        }
        else if (score <= 70) {

            category = "MEDIUM";
            status = "REFERRED";

        }
        else {

            category = "HIGH";
            status = "REJECTED";

        }

        double premium = calculatePremium(app, score);

        if (app.getAnnualIncome() != null &&
        	    app.getCoverageAmount() != null &&
        	    app.getCoverageAmount() > app.getAnnualIncome() * 20) {

        	    notes.append("Coverage exceeds 20x annual income; ");

        	    if ("APPROVED".equals(status)) {
        	        status = "REFERRED";
        	    }
        	}

        if (notes.length() == 0) notes.append("Standard case.");
        return new DecisionResult(status, score, category, round2(premium), notes.toString().trim());
    }

    private int scoreLife(PolicyApplication a, StringBuilder n) {
        int s = 0;
        if (Boolean.TRUE.equals(a.getSmoker()))       { s += 20; n.append("Smoker; "); }
        if (Boolean.TRUE.equals(a.getAlcoholUser()))  { s += 10; n.append("Alcohol use; "); }
        String d = a.getPreExistingDisease();
        if (d != null && !d.equalsIgnoreCase("NONE") && !d.isBlank()) {
            switch (d.toUpperCase()) {
            case "DIABETES"     -> { s += 10; n.append("Diabetes; "); }

            case "HYPERTENSION" -> { s += 10; n.append("Hypertension; "); }

            case "HEART"        -> { s += 25; n.append("Heart disease; "); }

            case "CANCER"       -> { s += 40; n.append("Cancer history; "); }

            default             -> { s += 8; n.append("Other disease; "); }
            }
        }
        return s;
    }

    private int scoreHealth(PolicyApplication a, StringBuilder n) {
        int s = 0;
        if (a.getHeightCm() != null && a.getWeightKg() != null && a.getHeightCm() > 0) {
            double h = a.getHeightCm() / 100.0;
            double bmi = a.getWeightKg() / (h * h);
            if (bmi < 18.5)    { s += 10; n.append("Underweight (BMI ").append(round2(bmi)).append("); "); }
            else if (bmi > 30) { s += 15; n.append("Obese (BMI ").append(round2(bmi)).append("); "); }
            else if (bmi > 25) { s += 10; n.append("Overweight; "); }
        }
        if (Boolean.TRUE.equals(a.getSmoker()))        { s += 15; n.append("Smoker; "); }
        if (Boolean.TRUE.equals(a.getFamilyHistory())) { s += 5; n.append("Family history; "); }
        String d = a.getPreExistingDisease();
        if (d != null && !d.equalsIgnoreCase("NONE") && !d.isBlank()) {
            s += 10; n.append("Pre-existing ").append(d).append("; ");
        }
        return s;
    }

    private int scoreMotor(PolicyApplication a, StringBuilder n) {
        int s = 0;
        if (a.getVehicleAge() != null) {
            if (a.getVehicleAge() > 10)     { s += 25; n.append("Vehicle age >10y; "); }
            else if (a.getVehicleAge() > 5) { s += 10; n.append("Vehicle age >5y; "); }
        }
        if (a.getPastClaims() != null) {
            if (a.getPastClaims() >= 3) {
                s += 25;
                n.append("3+ past claims; ");
            }
            else if (a.getPastClaims() == 2) {
                s += 15;
                n.append("2 past claims; ");
            }
            else if (a.getPastClaims() == 1) {
                s += 10;
                n.append("1 past claim; ");
            }
        }
        if ("COMMERCIAL".equalsIgnoreCase(a.getVehicleType()))      { s += 15; n.append("Commercial vehicle; "); }
        else if ("TWO_WHEELER".equalsIgnoreCase(a.getVehicleType())) s += 5;
        return s;
    }

    private int scoreHome(PolicyApplication a, StringBuilder n) {
        int s = 0;
        if (a.getPropertyAge() != null) {
            if (a.getPropertyAge() > 30)      { s += 25; n.append("Property age >30y; "); }
            else if (a.getPropertyAge() > 15) { s += 10; n.append("Property age >15y; "); }
        }
        String loc = a.getPropertyLocation();

        if ("HIGH_RISK".equalsIgnoreCase(loc)) {
            s += 25;
            n.append("High-risk zone; ");
        }
        else if ("MEDIUM_RISK".equalsIgnoreCase(loc)) {
            s += 10;
            n.append("Medium-risk zone; ");
        }
        if ("INDEPENDENT".equalsIgnoreCase(a.getPropertyType())) s += 5;
        return s;
    }

    private double calculatePremium(PolicyApplication a, int score) {

        double coverage = a.getCoverageAmount() == null ? 0 : a.getCoverageAmount();

        int term = (a.getTermYears() == null || a.getTermYears() <= 0)
                ? 1
                : a.getTermYears();

        double baseRate = switch (a.getInsuranceType()) {
            case LIFE -> 4.0;
            case HEALTH -> 6.0;
            case MOTOR -> 8.0;
            case HOME -> 3.0;
        };

        double planMultiplier = switch (a.getInsurancePlan()) {
            case BASIC -> 1.0;
            case STANDARD -> 1.20;
            case PREMIUM -> 1.50;
        };

        double riskMultiplier = 1 + (score / 100.0);

        double annualPremium =
                (coverage / 1000.0)
                * baseRate
                * planMultiplier
                * riskMultiplier;

        return annualPremium * term;
    }

    private double round2(double v) { return Math.round(v * 100.0) / 100.0; }
}
