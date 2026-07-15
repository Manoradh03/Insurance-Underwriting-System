import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
<nav style="
background:#0f172a;
color:white;
padding:14px 32px;
display:flex;
align-items:center;
height:72px;
box-shadow:0 2px 12px rgba(0,0,0,.15);
">

    <a
    [routerLink]="
auth.currentUser()?.role === 'ADMIN'
? '/admin'
: auth.currentUser()?.role === 'UNDERWRITER'
? '/underwriter'
: '/dashboard'
"
    style="display:flex;align-items:center;gap:12px;text-decoration:none;">

    <div style="
        width:46px;
        height:46px;
        border-radius:50%;
        background:#2563eb;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:22px;">
        🛡️
    </div>

    <div>

        <div style="
            font-size:23px;
            font-weight:700;
            line-height:22px;
            color:white;">
            NovaShield
        </div>

        <div style="
            font-size:12px;
            color:#cbd5e1;">
            Insurance Underwriting System
        </div>

    </div>

</a>

    <div style="width:50px;"></div>

  

    <a
   *ngIf="auth.currentUser()?.role === 'CUSTOMER'"
   routerLink="/apply"
   routerLinkActive="active"
   style="text-decoration:none;color:#cbd5e1;margin-left:25px;">
    New Application
</a>

    <a
   *ngIf="auth.currentUser()?.role === 'CUSTOMER'"
   routerLink="/my-applications"
   routerLinkActive="active"
   style="text-decoration:none;color:#cbd5e1;margin-left:25px;">
    My Applications
</a>

    <span style="flex:1;"></span>

    <div style="
    text-align:right;
    margin-right:18px;">

        <div style="
        font-size:14px;
        font-weight:600;
        color:white;">

            {{ auth.currentUser()?.fullName || auth.currentUser()?.username }}

        </div>

        <div style="
        font-size:12px;
        color:#94a3b8;">

            {{ auth.currentUser()?.role }}

        </div>

    </div>

    <button
        class="btn btn-secondary"
        (click)="auth.logout()">

        Logout

    </button>

</nav>

<div class="container"
     style="
     max-width:1450px;
     margin:auto;
     padding-top:30px;
     padding-bottom:40px;">

    <router-outlet />

</div>
`,
  styles: [`
.active{
    color:white !important;
    font-weight:600;
    border-bottom:3px solid #38bdf8;
    padding-bottom:8px;
}
`]
})
export class MainLayoutComponent {

  auth = inject(AuthService);

}