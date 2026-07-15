export type InsuranceType = 'LIFE' | 'HEALTH' | 'MOTOR' | 'HOME';

export interface AuthResponse { token: string; username: string; role: string; fullName: string; }

export interface ApplicationRequest {
  insuranceType: InsuranceType;
  insurancePlan?: 'BASIC' | 'STANDARD' | 'PREMIUM';
  age?: number; gender?: string; occupation?: string; 
  applicantName?: string;

nomineeName?: string;

nomineeRelationship?: string;

nomineeAge?: number;annualIncome?: number;
  coverageAmount?: number; termYears?: number;
  smoker?: boolean; alcoholUser?: boolean; preExistingDisease?: string;
  heightCm?: number; weightKg?: number; familyHistory?: boolean;
  vehicleType?: string; vehicleAge?: number; vehicleValue?: number; pastClaims?: number;
  propertyType?: string; propertyAge?: number; propertyValue?: number; propertyLocation?: string;
}

export interface DecisionResult {
  status: string; riskScore: number; riskCategory: string; premium: number; remarks: string;
}

export interface PolicyApplication extends ApplicationRequest {
  id: number;
  status: string;
  riskScore?: number;
  riskCategory?: string;
  premium?: number;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: { id: number; username: string; fullName?: string };
}
