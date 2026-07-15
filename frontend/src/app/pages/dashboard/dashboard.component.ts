import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { ApplicationService } from '../../core/services/application.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  auth = inject(AuthService);
  private router = inject(Router);

private applicationService = inject(ApplicationService);

applications: any[] = [];

loading = false;

ngOnInit(): void {

    if (this.auth.currentUser()?.role === 'UNDERWRITER') {

        this.router.navigate(['/underwriter']);

        return;

    }

    this.loadApplications();

}

loadApplications(): void {

    this.loading = true;

    this.applicationService.my().subscribe({

        next: (response: any) => {

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
