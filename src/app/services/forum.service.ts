import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class ForumService {

    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private apiUrlDiscussion =  `${environment.apiUrl}/discussions`;
    private apiUrlCommenatire = `${environment.apiUrl}/commentaires`;

    private getHeaders(): HttpHeaders {
        return this.authService.getAuthHeaders();
    }

    // GET DISCU
    getAllDiscu(boutiqueId: string): Observable<any> {
        return this.http.get(`${this.apiUrlDiscussion}/`, { headers: this.getHeaders() });
    }
    // NEW DISCU
    createDiscussion(titre: string, contenu: string): Observable<any> {
        return this.http.post(
            `${this.apiUrlDiscussion}/`,
            { titre, contenu },
            { headers: this.getHeaders() }
        );
    }
    // OPEN DISCU
    openDiscu(id: string): Observable<any> {
        return this.http.get(`${this.apiUrlDiscussion}/${id}`, { headers: this.getHeaders() });
    }
    // NEW COMMENTAIRE
    createCommentaire(discussion: string, contenu: string): Observable<any> {
        return this.http.post(
            `${this.apiUrlCommenatire}/`,
            { discussion, contenu },
            { headers: this.getHeaders() }
        );
    }
    //ANSWER COMMENTAIRE
    answerCommentaire(discussion: string, contenu: string, parent: string): Observable<any> {
        return this.http.post(
            `${this.apiUrlCommenatire}/`,
            { discussion, contenu, parent },
            { headers: this.getHeaders() }
        );
    }
    //GET DISCU COMMENTAIRE
    getCommentaires(id: string): Observable<any> {
        return this.http.get(`${this.apiUrlCommenatire}/discussion/${id}`, { headers: this.getHeaders() });
    }
}
