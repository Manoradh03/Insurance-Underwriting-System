import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
  <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;">
    <div class="card" style="width:100%;max-width:480px;">
      <h1>Create account</h1>
      <div class="grid-2">
        <div><label>Username</label><input
[(ngModel)]="model.username"
autocomplete="off"/></div>
        <div><label>Email</label><input
type="email"
[(ngModel)]="model.email"
autocomplete="off"/></div>
        <div><label>Full name</label><input [(ngModel)]="model.fullName"/></div>
        <div><label>Phone</label><input
[(ngModel)]="model.phone"
maxlength="10"
autocomplete="off"/></div>
        <div><label>Password</label><input
type="password"
[(ngModel)]="model.password"
autocomplete="new-password"/></div>
        <div><label>Role</label>
          <select [(ngModel)]="model.role">
            <option value="CUSTOMER">Customer</option>
            <option value="UNDERWRITER">Underwriter</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>
      <button class="btn btn-primary" style="width:100%;margin-top:20px;" (click)="submit()" [disabled]="loading">
        {{ loading ? 'Creating...' : 'Register' }}
      </button>
      <p *ngIf="error" class="error">{{ error }}</p>
      <p style="margin-top:16px;font-size:14px;">Have an account? <a routerLink="/login">Sign in</a></p>
    </div>
  </div>`
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  model: any = { role: 'CUSTOMER' };
  loading = false;
submitted = false;
error = '';

emailPattern =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  submit() {

  this.submitted = true;

  this.error = '';

  if (!this.model.username?.trim()) {

    this.error = 'Username is required';

    return;

  }

  if (!this.model.email?.trim()) {

    this.error = 'Email is required';

    return;

  }

  if (!this.emailPattern.test(this.model.email)) {

    this.error = 'Enter a valid email address';

    return;

  }

  if (!this.model.fullName?.trim()) {

    this.error = 'Full Name is required';

    return;

  }

  if (!this.model.phone?.trim()) {

    this.error = 'Phone Number is required';

    return;

  }

  if (!/^[0-9]{10}$/.test(this.model.phone)) {

    this.error = 'Phone Number must contain exactly 10 digits';

    return;

  }

  if (!this.model.password?.trim()) {

    this.error = 'Password is required';

    return;

  }

  if (this.model.password.length < 8) {

    this.error = 'Password must contain at least 8 characters';

    return;

  }

  this.loading = true;

  this.auth.register(this.model).subscribe({

    next: () => {

      this.router.navigate(['/dashboard']);

    },

    error: e => {

      this.loading = false;

      this.error =
        e?.error?.message || 'Registration failed';

    }

  });

}
}
