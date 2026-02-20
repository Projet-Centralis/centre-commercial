import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

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

  unreadCount = 0;
  notifications: any[] = [];

  showPanel = false;
  showToast = false;
  toastMessage: any = {};

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      console.log('[Header] currentUser$:', user);
      this.isAuthenticated = !!user;
      this.userEmail = user?.email || '';
      this.userType = user?.type_user || '';
      this.userName = this.getUserName();

      if (user) {
        this.notificationService.startListening();
      }
    });

    this.notificationService.unreadCountObservable$.subscribe(count => {
      console.log('[Header] unreadCount mis à jour:', count);
      this.unreadCount = count;
    });

    this.notificationService.notifications$.subscribe(notifs => {
      console.log('[Header] notifications$ mis à jour:', notifs);
      this.notifications = notifs;
    });

    this.notificationService.popup$.subscribe(event => {
      console.log('[Header] popup$ reçu:', event);
      this.toastMessage = event;
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
        console.log('[Header] Toast masqué');
      }, 4000);
    });
  }

  toggleNotifPanel(): void {
    this.showPanel = !this.showPanel;
    console.log('[Header] Panel toggled:', this.showPanel);
  }

  private getUserName(): string {
    if (this.userEmail) {
      const atIndex = this.userEmail.indexOf('@');
      return atIndex > 0 ? this.userEmail.substring(0, atIndex) : this.userEmail;
    }
    return '';
  }

  getUserTypeText(): string {
    switch (this.userType) {
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