import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../core/services/application.service';
import { PolicyApplication } from '../../core/models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  private svc = inject(ApplicationService);
  private router = inject(Router);

  applications: PolicyApplication[] = [];

filteredApplications: PolicyApplication[] = [];

searchText = '';

selectedStatus = '';

totalApplications = 0;
pendingApplications = 0;
approvedApplications = 0;
rejectedApplications = 0;


  ngOnInit() {

    this.loadApplications();

  }


  loadApplications() {

    this.svc.adminAll().subscribe(res => {

      this.applications = res;
      this.filteredApplications = res;

      this.totalApplications = res.length;

      this.pendingApplications =
        res.filter(a => a.status === 'REFERRED').length;

      this.approvedApplications =
        res.filter(a => a.status === 'APPROVED').length;

      this.rejectedApplications =
        res.filter(a => a.status === 'REJECTED').length;

    });

  }
  filterApplications() {

  this.filteredApplications = this.applications.filter(a => {

    const search =
      this.searchText.toLowerCase().trim();


    const matchesName =
      !search ||
      a.applicantName
      ?.toLowerCase()
      .includes(search);


    const matchesStatus =
      !this.selectedStatus ||
      a.status === this.selectedStatus;


    return matchesName && matchesStatus;

  });

}


  viewApplication(id:number) {

    this.router.navigate(['/applications', id]);

  }

}