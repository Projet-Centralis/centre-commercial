// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-header',
//   standalone: true,
//   imports: [],
//   templateUrl: './header.component.html',
//   styleUrl: './header.component.css'
// })
// export class HeaderComponent {

// }


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  userEmail = '';
  userType = '';
  userName = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.userEmail = user?.email || '';
      this.userType = user?.type_user || '';
      this.userName = this.getUserName();
    });
  }

  private getUserName(): string {
    if (this.userEmail) {
      const atIndex = this.userEmail.indexOf('@');
      return atIndex > 0 ? this.userEmail.substring(0, atIndex) : this.userEmail;
    }
    return '';
  }

  getUserTypeText(): string {
    switch(this.userType) {
      case 'ACHETEUR': return 'Acheteur';
      case 'BOUTIQUE': return 'Boutique';
      case 'ADMIN': return 'Administrateur';
      default: return 'Visiteur';
    }
  }

  logout(): void {
    this.authService.logout();
  }
}