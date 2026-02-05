// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   email: string = '';
//   password: string = '';
//   rememberMe: boolean = false;
//   isLoading: boolean = false;
  
//   // Pour afficher/masquer le mot de passe
//   showPassword: boolean = false;

//   onSubmit(): void {
//     if (!this.email || !this.password) {
//       return;
//     }
    
//     this.isLoading = true;
    
//     // Simuler une requête API
//     setTimeout(() => {
//       console.log('Login attempt:', { email: this.email, rememberMe: this.rememberMe });
//       this.isLoading = false;
//       // Ici vous intégrerez l'appel à votre service d'authentification
//     }, 1500);
//   }

//   togglePasswordVisibility(): void {
//     this.showPassword = !this.showPassword;
//   }

//   get passwordFieldType(): string {
//     return this.showPassword ? 'text' : 'password';
//   }
// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  isLoading: boolean = false;
  showPassword: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    const loginData = {
      email: this.email,
      password: this.password
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/accueil']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Email ou mot de passe incorrect';
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  get passwordFieldType(): string {
    return this.showPassword ? 'text' : 'password';
  }
}