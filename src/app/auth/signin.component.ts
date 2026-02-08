// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// interface UserType {
//   value: string;
//   label: string;
//   icon: string;
//   description: string;
// }

// @Component({
//   selector: 'app-signin',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './signin.component.html',
//   styleUrls: ['./signin.component.css']
// })
// export class SigninComponent {
//   email: string = '';
//   password: string = '';
//   confirmPassword: string = '';
//   userType: string = '';
//   acceptTerms: boolean = false;
//   isLoading: boolean = false;
//   showPassword: boolean = false;
//   showConfirmPassword: boolean = false;

//   userTypes: UserType[] = [
//     {
//       value: 'buyer',
//       label: 'Acheteur',
//       icon: 'bi bi-cart',
//       description: 'Accédez à toutes les boutiques et profitez des promotions'
//     },
//     {
//       value: 'shop',
//       label: 'Boutique',
//       icon: 'bi bi-shop',
//       description: 'Gérez votre boutique et vos produits'
//     }
//   ];

//   get selectedUserType(): UserType | undefined {
//     return this.userTypes.find(type => type.value === this.userType);
//   }

//   get passwordFieldType(): string {
//     return this.showPassword ? 'text' : 'password';
//   }

//   get confirmPasswordFieldType(): string {
//     return this.showConfirmPassword ? 'text' : 'password';
//   }

//   togglePasswordVisibility(): void {
//     this.showPassword = !this.showPassword;
//   }

//   toggleConfirmPasswordVisibility(): void {
//     this.showConfirmPassword = !this.showConfirmPassword;
//   }

//   get passwordsMatch(): boolean {
//     return this.password === this.confirmPassword;
//   }

//   get isFormValid(): boolean {
//     return !!this.email && 
//            !!this.password && 
//            !!this.confirmPassword && 
//            !!this.userType && 
//            this.acceptTerms && 
//            this.passwordsMatch &&
//            this.password.length >= 6;
//   }

//   // NOUVELLES MÉTHODES POUR LE STRENGTH METER
//   getStrengthClass(): string {
//     if (!this.password) return '';
    
//     const strength = this.calculatePasswordStrength();
//     if (strength < 3) return 'weak';
//     if (strength < 6) return 'medium';
//     return 'strong';
//   }

//   getStrengthText(): string {
//     if (!this.password) return '';
    
//     const strength = this.calculatePasswordStrength();
//     if (strength < 3) return 'Faible';
//     if (strength < 6) return 'Moyen';
//     return 'Fort';
//   }

//   calculatePasswordStrength(): number {
//     let strength = 0;
    
//     // Longueur minimale
//     if (this.password.length >= 6) strength++;
//     if (this.password.length >= 8) strength++;
    
//     // Contient des lettres minuscules
//     if (/[a-z]/.test(this.password)) strength++;
    
//     // Contient des lettres majuscules
//     if (/[A-Z]/.test(this.password)) strength++;
    
//     // Contient des chiffres
//     if (/[0-9]/.test(this.password)) strength++;
    
//     // Contient des caractères spéciaux
//     if (/[^A-Za-z0-9]/.test(this.password)) strength++;
    
//     return strength;
//   }

//   onSubmit(): void {
//     if (!this.isFormValid) {
//       return;
//     }
    
//     this.isLoading = true;
    
//     // Simuler une requête API
//     setTimeout(() => {
//       console.log('SignIn attempt:', { 
//         email: this.email, 
//         userType: this.userType 
//       });
//       this.isLoading = false;
//       // Ici vous intégrerez l'appel à votre service d'authentification
//     }, 1500);
//   }
// }
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from '../../services/auth.service';

// interface UserType {
//   value: 'ACHETEUR' | 'BOUTIQUE';
//   label: string;
//   icon: string;
//   description: string;
// }

// @Component({
//   selector: 'app-signin',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './signin.component.html',
//   styleUrls: ['./signin.component.css']
// })
// export class SigninComponent {
//   email: string = '';
//   password: string = '';
//   confirmPassword: string = '';
//   userType: 'ACHETEUR' | 'BOUTIQUE' = 'ACHETEUR';
//   acceptTerms: boolean = false;
//   isLoading: boolean = false;
//   showPassword: boolean = false;
//   showConfirmPassword: boolean = false;
//   errorMessage: string = '';

//   userTypes: UserType[] = [
//     {
//       value: 'ACHETEUR',
//       label: 'Acheteur',
//       icon: 'bi bi-cart',
//       description: 'Accédez à toutes les boutiques et profitez des promotions'
//     },
//     {
//       value: 'BOUTIQUE',
//       label: 'Boutique',
//       icon: 'bi bi-shop',
//       description: 'Gérez votre boutique et vos produits'
//     }
//     // ADMIN n'est pas disponible à l'inscription
//   ];

//   constructor(
//     private authService: AuthService,
//     private router: Router
//   ) {}

//   get selectedUserType(): UserType | undefined {
//     return this.userTypes.find(type => type.value === this.userType);
//   }

//   get passwordFieldType(): string {
//     return this.showPassword ? 'text' : 'password';
//   }

//   get confirmPasswordFieldType(): string {
//     return this.showConfirmPassword ? 'text' : 'password';
//   }

//   togglePasswordVisibility(): void {
//     this.showPassword = !this.showPassword;
//   }

//   toggleConfirmPasswordVisibility(): void {
//     this.showConfirmPassword = !this.showConfirmPassword;
//   }

//   get passwordsMatch(): boolean {
//     return this.password === this.confirmPassword;
//   }

//   get isFormValid(): boolean {
//     return !!this.email && 
//            !!this.password && 
//            !!this.confirmPassword && 
//            !!this.userType && 
//            this.acceptTerms && 
//            this.passwordsMatch &&
//            this.password.length >= 6;
//   }

//   getStrengthClass(): string {
//     if (!this.password) return '';
    
//     const strength = this.calculatePasswordStrength();
//     if (strength < 3) return 'weak';
//     if (strength < 6) return 'medium';
//     return 'strong';
//   }

//   getStrengthText(): string {
//     if (!this.password) return '';
    
//     const strength = this.calculatePasswordStrength();
//     if (strength < 3) return 'Faible';
//     if (strength < 6) return 'Moyen';
//     return 'Fort';
//   }

//   calculatePasswordStrength(): number {
//     let strength = 0;
    
//     if (this.password.length >= 6) strength++;
//     if (this.password.length >= 8) strength++;
//     if (/[a-z]/.test(this.password)) strength++;
//     if (/[A-Z]/.test(this.password)) strength++;
//     if (/[0-9]/.test(this.password)) strength++;
//     if (/[^A-Za-z0-9]/.test(this.password)) strength++;
    
//     return strength;
//   }

//   onSubmit(): void {
//     if (!this.isFormValid) {
//       this.errorMessage = 'Veuillez remplir tous les champs correctement';
//       return;
//     }
    
//     this.isLoading = true;
//     this.errorMessage = '';
    
//     const registerData = {
//       email: this.email,
//       password: this.password,
//       type_user: this.userType // Envoi direct de 'ACHETEUR' ou 'BOUTIQUE'
//     };

//     this.authService.register(registerData).subscribe({
//       next: (response) => {
//         this.isLoading = false;
//         this.router.navigate(['/accueil']);
//       },
//       error: (error) => {
//         this.isLoading = false;
//         this.errorMessage = error.message || 'Une erreur est survenue lors de l\'inscription';
//       }
//     });
//   }
// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface UserType {
  value: 'ACHETEUR' | 'BOUTIQUE';
  label: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  userType: 'ACHETEUR' | 'BOUTIQUE' = 'ACHETEUR';
  acceptTerms: boolean = false;
  isLoading: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  errorMessage: string = '';

  userTypes: UserType[] = [
    {
      value: 'ACHETEUR',
      label: 'Acheteur',
      icon: 'bi bi-cart',
      description: 'Accédez à toutes les boutiques et profitez des promotions'
    },
    {
      value: 'BOUTIQUE',
      label: 'Boutique',
      icon: 'bi bi-shop',
      description: 'Gérez votre boutique et vos produits'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get selectedUserType(): UserType | undefined {
    return this.userTypes.find(type => type.value === this.userType);
  }

  get passwordFieldType(): string {
    return this.showPassword ? 'text' : 'password';
  }

  get confirmPasswordFieldType(): string {
    return this.showConfirmPassword ? 'text' : 'password';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  get passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }

  get isFormValid(): boolean {
    return !!this.email && 
           !!this.password && 
           !!this.confirmPassword && 
           !!this.userType && 
           this.acceptTerms && 
           this.passwordsMatch &&
           this.password.length >= 6;
  }

  getStrengthClass(): string {
    if (!this.password) return '';
    
    const strength = this.calculatePasswordStrength();
    if (strength < 3) return 'weak';
    if (strength < 6) return 'medium';
    return 'strong';
  }

  getStrengthText(): string {
    if (!this.password) return '';
    
    const strength = this.calculatePasswordStrength();
    if (strength < 3) return 'Faible';
    if (strength < 6) return 'Moyen';
    return 'Fort';
  }

  calculatePasswordStrength(): number {
    let strength = 0;
    
    if (this.password.length >= 6) strength++;
    if (this.password.length >= 8) strength++;
    if (/[a-z]/.test(this.password)) strength++;
    if (/[A-Z]/.test(this.password)) strength++;
    if (/[0-9]/.test(this.password)) strength++;
    if (/[^A-Za-z0-9]/.test(this.password)) strength++;
    
    return strength;
  }

  onSubmit(): void {
    if (!this.isFormValid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement';
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    const registerData = {
      email: this.email,
      password: this.password,
      type_user: this.userType
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.redirectBasedOnUserType(response.user.type_user);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Une erreur est survenue lors de l\'inscription';
      }
    });
  }

  private redirectBasedOnUserType(userType: string): void {
    switch(userType) {
      case 'BOUTIQUE':
        this.router.navigate(['/boutique/dashboard']);
        break;
      case 'ACHETEUR':
        this.router.navigate(['/accueil']);
        break;
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      default:
        this.router.navigate(['/accueil']);
    }
  }
}