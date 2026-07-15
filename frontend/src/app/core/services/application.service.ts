import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from './api';
import {
  ApplicationRequest,
  DecisionResult,
  PolicyApplication
} from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private http = inject(HttpClient);

  submit(request: ApplicationRequest) {
    return this.http.post<PolicyApplication>(
      `${API_BASE}/applications`,
      request
    );
  }

  quote(request: ApplicationRequest) {
    return this.http.post<DecisionResult>(
      `${API_BASE}/applications/quote`,
      request
    );
  }

  // ---------------- Customer ----------------

  my() {
    return this.http.get<PolicyApplication[]>(
      `${API_BASE}/applications/my`
    );
  }

  myApplications() {
    return this.my();
  }

  one(id: number) {
    return this.http.get<PolicyApplication>(
      `${API_BASE}/applications/${id}`
    );
  }

  getApplication(id: number) {
    return this.one(id);
  }

  // ---------------- Admin ----------------

  adminAll() {
    return this.http.get<PolicyApplication[]>(
      `${API_BASE}/admin/applications`
    );
  }

  getAllApplications() {
    return this.adminAll();
  }

  adminDecide(
    id: number,
    status: string,
    remarks: string
  ) {
    return this.http.put<PolicyApplication>(
      `${API_BASE}/admin/applications/${id}/decision`,
      {
        status,
        remarks
      }
    );
  }

  decideApplication(
    id: number,
    status: string,
    remarks: string
  ) {
    return this.adminDecide(id, status, remarks);
  }

}