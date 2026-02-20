import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ForumService {

    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private apiUrlDiscussion = 'http://localhost:5000/api/discussions';
    private apiUrlCommenatire = 'http://localhost:5000/api/commentaires';

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
