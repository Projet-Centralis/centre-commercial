import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="app-footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-copyright">
            <i class="bi bi-c-circle"></i>
            <span>2026 Tous droits réservés</span>
          </div>
          
          <div class="footer-divider"></div>
          
          <div class="footer-authors">
            <div class="author">
              <i class="bi bi-person-circle"></i>
              <div class="author-info">
                <span class="author-name">RAKOTONIRINA Andry Ny Aina</span>
                <span class="author-id">ETU002813</span>
              </div>
            </div>
            
            <div class="author-separator"></div>
            
            <div class="author">
              <i class="bi bi-person-circle"></i>
              <div class="author-info">
                <span class="author-name">Ifaliana Beatrix</span>
                <span class="author-id">ETU000012</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="footer-powered">
          <span>Centralis</span>
          <span class="dot">•</span>
          <span>Projet MEAN Master 1 - Mars 2026</span>
        </div>
      </div>
    </footer>
  `,
  styles: [`
     .app-footer {
    background: #1a1d2e;
    border-top: 2px solid #13514b;
    padding: 16px 20px;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    position: relative;
    z-index: 10;
    flex-shrink: 0; /* Empêche le footer de rétrécir */
    width: 100%;
  }

    .app-footer::before {
      content: '';
      position: absolute;
      top: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, #32bcae, transparent);
    }

    .footer-container {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .footer-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 20px;
    }

    .footer-copyright {
      display: flex;
      align-items: center;
      gap: 6px;
      color: rgba(255, 255, 255, 0.6);
      font-size: 13px;
    }

    .footer-copyright i {
      color: #32bcae;
      font-size: 14px;
    }

    .footer-divider {
      width: 1px;
      height: 30px;
      background: linear-gradient(180deg, transparent, #13514b, #32bcae, #13514b, transparent);
    }

    .footer-authors {
      display: flex;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
    }

    .author {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 12px;
      background: #101324;
      border-radius: 30px;
      border: 1px solid #13514b;
      transition: all 0.3s ease;
    }

    .author:hover {
      border-color: #32bcae;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(50, 188, 174, 0.2);
    }

    .author i {
      color: #32bcae;
      font-size: 18px;
    }

    .author-info {
      display: flex;
      flex-direction: column;
    }

    .author-name {
      color: #ffffff;
      font-size: 13px;
      font-weight: 600;
    }

    .author-id {
      color: #32bcae;
      font-size: 11px;
      font-weight: 500;
      opacity: 0.8;
    }

    .author-separator {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #32bcae;
      opacity: 0.5;
    }

    .footer-powered {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding-top: 8px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.4);
      font-size: 11px;
    }

    .footer-powered span:first-child {
      color: #32bcae;
      font-weight: 600;
    }

    .dot {
      color: #32bcae;
      opacity: 0.5;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .footer-content {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .footer-divider {
        width: 100px;
        height: 1px;
        background: linear-gradient(90deg, transparent, #13514b, #32bcae, #13514b, transparent);
      }

      .footer-authors {
        justify-content: center;
      }

      .author {
        width: 100%;
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .footer-authors {
        flex-direction: column;
        gap: 10px;
      }

      .author-separator {
        display: none;
      }

      .app-footer {
        padding: 12px 15px;
      }
    }
  `]
})
export class FooterComponent {}