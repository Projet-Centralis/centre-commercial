import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, interval, switchMap, BehaviorSubject, Subject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:5000/api/notifications';

  // Pour le nombre de notifications non lues
  private unreadCount$ = new BehaviorSubject<number>(0);
  unreadCountObservable$ = this.unreadCount$.asObservable();

  // Pour propager les notifications vers le header
  private popupSubject = new Subject<any>();
  popup$ = this.popupSubject.asObservable();

  private notificationsSubject = new BehaviorSubject<any[]>([]);
  notifications$ = this.notificationsSubject.asObservable();


  private lastNotificationId: number | null = null;

  private getHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  getNotificationsUser(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, { headers: this.getHeaders() });
  }


  startListening() {
    interval(5000)
      .pipe(switchMap(() => this.getNotificationsUser()))
      .subscribe((notifications) => {
        const unread = notifications.filter(n => !n.read).length; this.unreadCount$.next(unread);
        this.notificationsSubject.next(notifications);
        if (notifications.length > 0) {
          const latest = notifications[0];
          if (this.lastNotificationId === null) {
            // Premier appel : on mémorise sans émettre            this.lastNotificationId = latest._id;
          } else if (latest._id !== this.lastNotificationId) {
            // Nouvelle notification détectée après l'init            this.popupSubject.next(latest);
            this.lastNotificationId = latest._id;
          } else { }
        }
      });
  }
}
