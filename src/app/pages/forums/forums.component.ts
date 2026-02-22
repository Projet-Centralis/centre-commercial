import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForumService } from '../../services/forum.service';

@Component({
  selector: 'app-forums',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forums.component.html',
  styleUrls: ['./forums.component.css']
})
export class ForumsComponent implements OnInit {

  discussions: any[] = [];
  selectedDiscussion: any = null;
  commentaires: any[] = [];

  // Form fields
  newTitre: string = '';
  newContenu: string = '';
  newCommentaire: string = '';

  loading = false;

  constructor(private forumService: ForumService) { }

  ngOnInit(): void {
    this.loadDiscussions();
  }

  // ==============================
  // LOAD DISCUSSIONS
  // ==============================
  loadDiscussions() {
    this.loading = true;

    this.forumService.getAllDiscu('').subscribe({
      next: (res) => {
        this.discussions = res.data;
        this.loading = false;

          this.loadNbCommentaires();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  // ==============================
  // CREATE DISCUSSION
  // ==============================
  createDiscussion() {
    if (!this.newTitre.trim() || !this.newContenu.trim()) return;

    this.forumService.createDiscussion(this.newTitre, this.newContenu)
      .subscribe({
        next: () => {
          this.newTitre = '';
          this.newContenu = '';
          this.loadDiscussions();
        },
        error: (err) => console.error(err)
      });
  }

  // ==============================
  // OPEN DISCUSSION
  // ==============================
  openDiscussion(id: string) {
    this.forumService.openDiscu(id).subscribe({
      next: (res) => {
        this.selectedDiscussion = res.data;
        this.loadCommentaires(id);
      },
      error: (err) => console.error(err)
    });
  }

  // ==============================
  // LOAD COMMENTAIRES
  // ==============================
  loadCommentaires(id: string) {
    this.forumService.getCommentaires(id).subscribe({
      next: (res) => {
        this.commentaires = this.organiserCommentaires(res.data);
      },
      error: (err) => console.error(err)
    });
  }

  // ==============================
  // ADD COMMENTAIRE (parent)
  // ==============================
  addCommentaire() {
    if (!this.newCommentaire.trim() || !this.selectedDiscussion) return;

    this.forumService.createCommentaire(
      this.selectedDiscussion._id,
      this.newCommentaire
    ).subscribe({
      next: () => {
        this.newCommentaire = '';
        this.loadCommentaires(this.selectedDiscussion._id);
      },
      error: (err) => console.error(err)
    });
  }
  loadNbCommentaires() {

    this.discussions.forEach(d => {

      this.forumService.getCommentaires(d._id).subscribe({
        next: (res) => {
          d.nbCommentaires = res.data.length;
        },
        error: () => {
          d.nbCommentaires = 0;
        }

      });

    });

  }

  // ==============================
  // REPLY COMMENTAIRE (child)
  // ==============================
  replyCommentaire(parentId: string, contenu: string) {
    if (!contenu.trim()) return;

    this.forumService.answerCommentaire(
      this.selectedDiscussion._id,
      contenu,
      parentId
    ).subscribe({
      next: () => {
        this.loadCommentaires(this.selectedDiscussion._id);
      },
      error: (err) => console.error(err)
    });
  }

  organiserCommentaires(data: any[]) {

    const map = new Map<string, any>();
    const roots: any[] = [];

    data.sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    data.forEach(c => {
      c.sousCommentaires = [];
      map.set(c._id, c);
    });

    data.forEach(c => {

      if (c.parent) {

        const parentId =
          typeof c.parent === 'object' ? c.parent._id : c.parent;

        const parentComment = map.get(parentId);

        if (parentComment) {
          parentComment.sousCommentaires.push(c);
        } else {
          roots.push(c);
        }

      } else {
        roots.push(c);
      }

    });

    return roots;
  }

  // ==============================
  // CLOSE POPUP
  // ==============================
  closeDiscussion() {
    this.selectedDiscussion = null;
    this.commentaires = [];
  }

}
