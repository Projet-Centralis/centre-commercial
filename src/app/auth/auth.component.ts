
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { LoginComponent } from './login.component';
// import { SigninComponent } from './signin.component';

// @Component({
//   selector: 'app-auth',
//   standalone: true,
//   imports: [CommonModule, LoginComponent, SigninComponent],
//   templateUrl: './auth.component.html',
//   styleUrls: ['./auth.component.css']
// })
// export class AuthComponent {
//   isLoginMode: boolean = true;

//   toggleMode(): void {
//     this.isLoginMode = !this.isLoginMode;
//   }

//   getCardClass(): string {
//     return this.isLoginMode ? 'auth-card login-mode' : 'auth-card signin-mode';
//   }
// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { SigninComponent } from './signin.component';
import { FooterComponent } from '../components/footer/footer.component'; // Import du footer

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule, 
    LoginComponent, 
    SigninComponent,
    FooterComponent // Ajout du footer
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLoginMode: boolean = true;

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  getCardClass(): string {
    return this.isLoginMode ? 'auth-card login-mode' : 'auth-card signin-mode';
  }
}