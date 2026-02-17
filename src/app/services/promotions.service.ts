import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class PromotionService {

    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private apiUrl = 'http://localhost:5000/api/promotions';

    private getHeaders(): HttpHeaders {
        return this.authService.getAuthHeaders();
    }

    // GET PROMOTIONS
    getAllPromotions(boutiqueId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/`, { headers: this.getHeaders() });
    }
    
}
