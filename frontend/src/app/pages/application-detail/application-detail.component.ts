import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApplicationService } from '../../core/services/application.service';
import { AuthService } from '../../core/services/auth.service';
import { PolicyApplication } from '../../core/models/models';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
  <div style="margin-bottom:20px;">

<button
class="btn btn-secondary"
(click)="back()">

← Back to Applications

</button>

</div>
  <h1 *ngIf="app && auth.currentUser()?.role === 'UNDERWRITER'">

    Underwriter Review

</h1>
<div
*ngIf="message"
style="
background:#dcfce7;
color:#166534;
padding:12px 18px;
border-radius:8px;
margin:20px 0;
font-weight:600;
">

    ✓ {{message}}

</div>

<h1 *ngIf="app && auth.currentUser()?.role !== 'UNDERWRITER'">

    Application #{{app.id}} — {{app.insuranceType}}

</h1>
  <div class="card" *ngIf="app">
  <h2>

    Applicant Information

</h2>
    <div class="grid-2">

<div><b>Applicant Name:</b> {{app.applicantName}}</div>

<div><b>Age:</b> {{app.age}}</div>

<div><b>Gender:</b> {{app.gender}}</div>

<div><b>Occupation:</b> {{app.occupation}}</div>

<div><b>Annual Income:</b> ₹ {{app.annualIncome | number}}</div>

</div>

<hr style="margin:20px 0;">

<h2>Policy Information</h2>
<p class="muted">
Review the policy details and underwriting assessment before making a decision.
</p>

<div class="grid-2">

<div><b>Insurance Type:</b> {{app.insuranceType}}</div>

<div><b>Insurance Plan:</b> {{app.insurancePlan}}</div>

<div><b>Coverage Amount:</b> ₹ {{app.coverageAmount | number}}</div>

<div><b>Policy Term:</b> {{app.termYears}} Years</div>

<div><b>Premium:</b> ₹ {{app.premium | number:'1.2-2'}}</div>

<div>

    <b>Risk Category:</b>

    <span class="badge badge-{{app.riskCategory}}">
        
        {{app.riskCategory}}

    </span>

</div>


<div>

    <b>Status:</b>

    <span class="badge badge-{{app.status}}">

        <span *ngIf="app.status==='REFERRED'">
            Pending Review
        </span>

        <span *ngIf="app.status==='APPROVED'">
            Approved
        </span>

        <span *ngIf="app.status==='REJECTED'">
            Rejected
        </span>

    </span>

</div>
<div>

    <b>Risk Score:</b>

    {{app.riskScore}} / 100


    <div style="
        margin-top:10px;
        height:10px;
        background:#e5e7eb;
        border-radius:10px;
        overflow:hidden;
    ">

        <div
            [style.width.%]="app.riskScore"
            style="
                height:100%;
                background:#2563eb;
                border-radius:10px;
            ">
        </div>

    </div>

</div>

</div>    <hr style="margin:20px 0;border:none;border-top:1px solid #e5e7eb;"/>
    


<!-- LIFE INSURANCE -->

<div *ngIf="app.insuranceType === 'LIFE'">

    <hr style="margin:20px 0;">

    <h3>Life Insurance Details</h3>

    <div class="grid-2">

        <div>

            <b>Smoker:</b>

            {{app.smoker ? 'Yes' : 'No'}}

        </div>

        <div>

            <b>Alcohol User:</b>

            {{app.alcoholUser ? 'Yes' : 'No'}}

        </div>

        <div>

            <b>Pre-existing Disease:</b>

            {{app.preExistingDisease}}

        </div>

        <div>

            <b>Nominee Name:</b>

            {{app.nomineeName}}

        </div>

        <div>

            <b>Relationship:</b>

            {{app.nomineeRelationship}}

        </div>

        <div>

            <b>Nominee Age:</b>

            {{app.nomineeAge}}

        </div>

    </div>

</div>
<!-- HEALTH INSURANCE -->

<div *ngIf="app.insuranceType === 'HEALTH'">

    <hr style="margin:20px 0;">

    <h3>Health Insurance Details</h3>

    <div class="grid-2">

        <div>

            <b>Height:</b>

            {{app.heightCm}} cm

        </div>

        <div>

            <b>Weight:</b>

            {{app.weightKg}} kg

        </div>

        <div>

            <b>Smoker:</b>

            {{app.smoker ? 'Yes' : 'No'}}

        </div>

        <div>

            <b>Family History:</b>

            {{app.familyHistory ? 'Yes' : 'No'}}

        </div>

        <div>

            <b>Pre-existing Disease:</b>

            {{app.preExistingDisease}}

        </div>

        <div>

            <b>Nominee Name:</b>

            {{app.nomineeName}}

        </div>

        <div>

            <b>Relationship:</b>

            {{app.nomineeRelationship}}

        </div>

        <div>

            <b>Nominee Age:</b>

            {{app.nomineeAge}}

        </div>

    </div>

</div>
<!-- MOTOR INSURANCE -->

<div *ngIf="app.insuranceType === 'MOTOR'">

    <hr style="margin:20px 0;">

    <h3>Motor Insurance Details</h3>

    <div class="grid-2">

        <div>

            <b>Vehicle Type:</b>

            {{app.vehicleType}}

        </div>

        <div>

            <b>Vehicle Age:</b>

            {{app.vehicleAge}} Years

        </div>

        <div>

            <b>Vehicle Value:</b>

            ₹ {{app.vehicleValue | number}}

        </div>

        <div>

            <b>Previous Claims:</b>

            {{app.pastClaims}}

        </div>

    </div>

</div>
<!-- HOME INSURANCE -->

<div *ngIf="app.insuranceType === 'HOME'">

    <hr style="margin:20px 0;">

    <h3>Home Insurance Details</h3>

    <div class="grid-2">

        <div>

            <b>Property Type:</b>

            {{app.propertyType}}

        </div>

        <div>

            <b>Property Age:</b>

            {{app.propertyAge}} Years

        </div>

        <div>

            <b>Property Value:</b>

            ₹ {{app.propertyValue | number}}

        </div>

        <div>

            <b>Risk Zone:</b>

            {{app.propertyLocation}}

        </div>

    </div>

</div>
<!-- UNDERWRITER DECISION -->

<div *ngIf="auth.currentUser()?.role === 'UNDERWRITER' && app.status === 'REFERRED'">

    <hr style="margin:25px 0;">

    <h2>Underwriter Decision</h2>

    <p>

        This application requires manual underwriting review.

    </p>

    <!-- UNDERWRITER DECISION -->

<div *ngIf="auth.currentUser()?.role==='UNDERWRITER' && app.status==='REFERRED'">

<hr style="margin:25px 0;">

<h2>Underwriter Decision</h2>

<label><b>Underwriter Remarks</b></label>

<textarea

[(ngModel)]="underwriterRemarks"

rows="4"

style="width:100%;padding:10px;border:1px solid #d1d5db;border-radius:8px;margin:15px 0;resize:none;">

</textarea>

<button
class="btn btn-success"
(click)="approveApplication()">

Approve

</button>

<button
class="btn btn-danger"
style="margin-left:10px;"
(click)="rejectApplication()">

Reject

</button>

</div>

    <p><b>Remarks:</b> {{app.remarks}}</p>
    <hr style="margin:20px 0;">

<p>

<b>Application Submitted On:</b>

{{app.createdAt | date:'dd-MMM-yyyy hh:mm a'}}

</p>
  </div>`
})
export class ApplicationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private svc = inject(ApplicationService);
  private router = inject(Router);
  auth = inject(AuthService);
  app: PolicyApplication | null = null;
  underwriterRemarks = '';
  message = '';
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.svc.one(id).subscribe(r => this.app = r);
  }
  back() {

    const role = this.auth.currentUser()?.role;


    if (role === 'ADMIN') {

      this.router.navigate(['/admin']);

    }
    else if (role === 'UNDERWRITER') {

      this.router.navigate(['/underwriter']);

    }
    else {

      this.router.navigate(['/my-applications']);

    }

}

  approveApplication() {

    if (!this.app) return;

    this.svc
      .adminDecide(this.app.id, 'APPROVED', this.underwriterRemarks)
      .subscribe(() => {

        this.message = 'Application approved successfully.';

setTimeout(() => {

  this.router.navigate(['/underwriter']);

}, 1500);

      });

  }

  rejectApplication() {

    if (!this.app) return;

    this.svc
      .adminDecide(this.app.id, 'REJECTED', this.underwriterRemarks)
      .subscribe(() => {

        this.message = 'Application rejected successfully.';

setTimeout(() => {

  this.router.navigate(['/underwriter']);

}, 1500);

      });

  }

}
