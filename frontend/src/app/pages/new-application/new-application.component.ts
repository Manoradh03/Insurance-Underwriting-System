import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ApplicationService } from '../../core/services/application.service';
import {
  ApplicationRequest,
  DecisionResult,
  InsuranceType
} from '../../core/models/models';

@Component({
  selector: 'app-new-application',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-application.component.html',
  styleUrls: ['./new-application.component.css']
})
export class NewApplicationComponent {

  constructor() {

    this.route.queryParams.subscribe(params => {

      const type = params['type'];

      if (type) {

        this.model.insuranceType = type as InsuranceType;

      }

    });}

  private svc = inject(ApplicationService);

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  model: ApplicationRequest = {

    insuranceType: 'LIFE' as InsuranceType,

    insurancePlan: 'BASIC',

    gender: 'MALE',

    smoker: false,

    alcoholUser: false,

    familyHistory: false,

    preExistingDisease: 'NONE'

  };

  quote: DecisionResult | null = null;

  loading = false;

  error = '';

  clearQuote() {

    this.quote = null;

  }

  private resetForm(): void {

    this.model = {

      insuranceType: 'LIFE' as InsuranceType,

      insurancePlan: 'BASIC',

      gender: 'MALE',

      smoker: false,

      alcoholUser: false,

      familyHistory: false,

      preExistingDisease: 'NONE'

    };

    this.quote = null;

    this.error = '';

    this.loading = false;

  }

  getQuote() {

  this.error = '';

  let errors: string[] = [];


  // Common validations

  if (!this.model.applicantName?.trim()) {

    errors.push('Applicant Name is required');

  }


  if (!this.model.age || this.model.age < 18) {

    errors.push('Age must be 18 years or above');

  }


  if (!this.model.occupation?.trim()) {

    errors.push('Occupation is required');

  }


  if (!this.model.annualIncome || this.model.annualIncome <= 0) {

    errors.push('Annual Income is required');

  }


  if (!this.model.coverageAmount || this.model.coverageAmount <= 0) {

    errors.push('Coverage Amount is required');

  }


  if (!this.model.termYears || this.model.termYears <= 0) {

    errors.push('Policy Term is required');

  }



  // LIFE validation

  if (this.model.insuranceType === 'LIFE') {


    if (!this.model.nomineeName?.trim()) {

      errors.push('Nominee Name is required');

    }


    if (!this.model.nomineeRelationship?.trim()) {

      errors.push('Nominee Relationship is required');

    }


    if (!this.model.nomineeAge || this.model.nomineeAge <= 0) {

      errors.push('Nominee Age is required');

    }

  }



  if(errors.length > 0){

    this.error =
    'Please fix the following errors:\n\n• ' +
    errors.join('\n• ');

    return;

  }



  this.loading = true;


  this.svc.quote(this.model).subscribe({

    next: r => {

      this.quote = r;

      this.loading = false;

    },


    error: e => {

      this.error =
      e?.error?.message || 'Quote failed';

      this.loading = false;

    }

  });

}

  submit() {

  this.error = '';

  let errors: string[] = [];


  // Common validations

  if (!this.model.applicantName?.trim()) {

    errors.push('Applicant Name is required');

  }


  if (!this.model.age || this.model.age < 18) {

    errors.push('Age must be 18 years or above');

  }


  if (!this.model.occupation?.trim()) {

    errors.push('Occupation is required');

  }


  if (!this.model.annualIncome || this.model.annualIncome <= 0) {

    errors.push('Annual Income is required');

  }


  if (!this.model.coverageAmount || this.model.coverageAmount <= 0) {

    errors.push('Coverage Amount is required');

  }


  if (!this.model.termYears || this.model.termYears <= 0) {

    errors.push('Policy Term is required');

  }


  // Insurance type validation

  if (!this.model.insuranceType) {

    errors.push('Insurance Type is required');

  }


  if (!this.model.insurancePlan) {

    errors.push('Insurance Plan is required');

  }

  // ---------- LIFE INSURANCE ----------

if (this.model.insuranceType === 'LIFE') {

  if (!this.model.nomineeName?.trim()) {

    errors.push('Nominee Name is required');

  }

  if (!this.model.nomineeRelationship?.trim()) {

    errors.push('Nominee Relationship is required');

  }

  if (!this.model.nomineeAge || this.model.nomineeAge <= 0) {

    errors.push('Nominee Age is required');

  }

}


// ---------- HEALTH INSURANCE ----------

if (this.model.insuranceType === 'HEALTH') {

  if (!this.model.heightCm || this.model.heightCm <= 0) {

    errors.push('Height is required');

  }

  if (!this.model.weightKg || this.model.weightKg <= 0) {

    errors.push('Weight is required');

  }

}


// ---------- MOTOR INSURANCE ----------

if (this.model.insuranceType === 'MOTOR') {

  if (!this.model.vehicleType?.trim()) {

    errors.push('Vehicle Type is required');

  }

  if (!this.model.vehicleAge || this.model.vehicleAge < 0) {

    errors.push('Vehicle Age is required');

  }

  if (!this.model.vehicleValue || this.model.vehicleValue <= 0) {

    errors.push('Vehicle Value is required');

  }
     
}


// ---------- HOME INSURANCE ----------

if (this.model.insuranceType === 'HOME') {

  if (!this.model.propertyType?.trim()) {

    errors.push('Property Type is required');

  }

  if (!this.model.propertyAge || this.model.propertyAge < 0) {

    errors.push('Property Age is required');

  }

  if (!this.model.propertyValue || this.model.propertyValue <= 0) {

    errors.push('Property Value is required');

  }

  if (!this.model.propertyLocation?.trim()) {

    errors.push('Property Location is required');

  }

}



  if(errors.length > 0){

    this.error =
    'Please fix the following errors:\n\n• ' +
    errors.join('\n• ');

    return;

  }



  this.loading = true;


  this.svc.submit(this.model).subscribe({

    next: r => {

      this.resetForm();

      this.router.navigate(['/applications', r.id]);

    },


    error: e => {

      this.error =
      e?.error?.message || 'Submission failed';

      this.loading = false;

    }

  });


}

}