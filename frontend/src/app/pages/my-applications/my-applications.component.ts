import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ApplicationService } from '../../core/services/application.service';
import { PolicyApplication } from '../../core/models/models';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.css']
})
export class MyApplicationsComponent implements OnInit {

  private applicationService = inject(ApplicationService);

  applications: PolicyApplication[] = [];

  loading = false;

  ngOnInit(): void {

    this.loadApplications();

  }

  loadApplications(): void {

    this.loading = true;

    this.applicationService.my().subscribe({

      next: (response) => {

        this.applications = response;

        this.loading = false;

      },

      error: () => {

        this.loading = false;

        this.applications = [];

      }

    });

  }

}