import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_BASE } from './api';
import { AuthResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<AuthResponse | null>(this.load());

  private load(): AuthResponse | null {
    const raw = localStorage.getItem('ius_user');
    return raw ? JSON.parse(raw) : null;
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE}/auth/login`, { username, password })
      .pipe(tap(res => this.persist(res)));
  }

  register(body: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE}/auth/register`, body)
      .pipe(tap(res => this.persist(res)));
  }

  logout() {
    localStorage.removeItem('ius_user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  token(): string | null { return this.currentUser()?.token ?? null; }
  isAdmin(): boolean {
    const r = this.currentUser()?.role;
    return r === 'ADMIN' || r === 'UNDERWRITER';
  }

  private persist(res: AuthResponse) {
    localStorage.setItem('ius_user', JSON.stringify(res));
    this.currentUser.set(res);
  }
}
