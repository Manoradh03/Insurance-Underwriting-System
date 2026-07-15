package com.capstone.ius.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DecisionResult {
    private String status;       // APPROVED / REJECTED / REFERRED
    private Integer riskScore;
    private String riskCategory; // LOW / MEDIUM / HIGH
    private Double premium;
    private String remarks;
}
