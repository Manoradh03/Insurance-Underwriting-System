import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../core/services/application.service';
import { PolicyApplication } from '../../core/models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-underwriter-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./underwriter-dashboard.component.css'],
  templateUrl: './underwriter-dashboard.component.html',
})
export class UnderwriterDashboardComponent implements OnInit {
  selectedView = '';
  totalApplications = 0;
  pendingApplications = 0;
  approvedApplications = 0;
  rejectedApplications = 0;
  private svc = inject(ApplicationService);
  private router = inject(Router);
  apps: PolicyApplication[] = [];
  filteredApps: PolicyApplication[] = [];
  searchText = '';
  ngOnInit() { this.load(); }
  load() {

    this.svc.adminAll().subscribe(r => {

      this.apps = r;

      this.filteredApps = r;

      this.totalApplications = r.length;

      this.pendingApplications =
        r.filter(x => x.status === 'REFERRED').length;

      this.approvedApplications =
        r.filter(x => x.status === 'APPROVED').length;

      this.rejectedApplications =
        r.filter(x => x.status === 'REJECTED').length;

    });

  }
  
  showApplications(status: string) {

  this.selectedView = status;

  if (status === 'ALL') {

    this.filteredApps = this.apps;

  } else {

    this.filteredApps =
      this.apps.filter(a => a.status === status);

  }

}
  review(id: number) {

    this.router.navigate(['/applications', id]);

}


  decide(a: PolicyApplication, status: string) {
    const remarks = prompt(`Remarks for ${status}?`, '') || '';
    this.svc.adminDecide(a.id, status, remarks).subscribe(() => this.load());
  }
}
