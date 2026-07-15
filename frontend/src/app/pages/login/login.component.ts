import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
  <div style="min-height:100vh;background:#eef4ff;display:flex;align-items:center;justify-content:center;padding:30px;">

    <div class="card"
         style="width:100%;max-width:460px;padding:35px;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.15);">

      <div style="text-align:center;margin-bottom:28px;">

  <div
    style="
      display:flex;
      justify-content:center;
      align-items:center;
      gap:14px;
      margin-bottom:18px;">

    <div
      style="
        width:58px;
        height:58px;
        border-radius:50%;
        background:#2563eb;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:28px;
        color:white;">

      🛡️

    </div>

    <div style="text-align:left;">

      <div
        style="
          font-size:38px;
          font-weight:700;
          color:#0f172a;
          line-height:36px;">

        NovaShield

      </div>

      <div
        style="
          font-size:15px;
          color:#64748b;">

        Insurance Underwriting System

      </div>

    </div>

  </div>

  <p
    style="
      color:#64748b;
      margin:0;
      font-size:15px;">

    Secure Customer Login

  </p>

</div>


      <label>
        Username *
      </label>

      <input
        [(ngModel)]="username"
        placeholder="Enter Username"
        autocomplete="username"
        name="username"
        style="width:100%;margin-bottom:10px;"
      />


      <small 
        style="color:red"
        *ngIf="error==='Username is required'">

        Username is required

      </small>


      <label style="margin-top:15px;">
        Password *
      </label>


      <input
        type="password"
        [(ngModel)]="password"
        placeholder="Enter Password"
        autocomplete="current-password"
        name="password"
        style="width:100%;margin-bottom:10px;"
      />


      <small 
        style="color:red"
        *ngIf="error==='Password is required'">

        Password is required

      </small>


      <small 
        style="color:red"
        *ngIf="error==='Password must contain at least 8 characters'">

        Password must contain at least 8 characters.

      </small>



      <button
        class="btn btn-primary"
        style="width:100%;margin-top:20px;"
        (click)="submit()"
        [disabled]="loading">


        {{loading ? 'Signing In...' : 'Sign In'}}


      </button>



      <p *ngIf="error && 
      error!=='Username is required' &&
      error!=='Password is required' &&
      error!=='Password must contain at least 8 characters'"
      
      style="color:red;margin-top:15px;text-align:center;">

        {{error}}

      </p>



      <hr style="margin:25px 0;">


      <div style="text-align:center;">

        Don't have an account?

        <a routerLink="/register">
          Register
        </a>


      </div>


    </div>

  </div>
  `
})
export class LoginComponent implements OnInit {


  private auth = inject(AuthService);

  private router = inject(Router);


  username = '';

  password = '';

  loading = false;

  submitted = false;

  error = '';



  ngOnInit() {

    // Clear old browser filled values

    this.username = '';

    this.password = '';

    this.error = '';

  }



  submit() {


    this.error = '';



    if (this.username.trim() === '') {


      this.error = 'Username is required';

      return;

    }



    if (this.password.trim() === '') {


      this.error = 'Password is required';

      return;

    }



    if (this.password.length < 8) {


      this.error = 'Password must contain at least 8 characters';

      return;

    }



    this.loading = true;



    this.auth.login(this.username, this.password)
      .subscribe({


        next: () => {


          const user = this.auth.currentUser();



          if (user?.role === 'ADMIN') {


            this.router.navigate(['/admin']);


          }
          else if (user?.role === 'UNDERWRITER') {


            this.router.navigate(['/underwriter']);


          }
          else {


            this.router.navigate(['/dashboard']);


          }


        },



        error: e => {


          this.loading = false;


          this.error =
            e?.error?.message ||
            'Invalid Username or Password';


        }


      });


  }


}