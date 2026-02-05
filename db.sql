CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    type_user VARCHAR(20) REFERENCES type_users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

CREATE TABLE type_users (
    id SERIAL PRIMARY KEY,
    type_user VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE boutiques (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nom_boutique VARCHAR(150) NOT NULL,
    description TEXT,
    logo VARCHAR(500),
    telephone VARCHAR(20),
    email_contact VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE boutiques_favoris(
    id SERIAL PRIMARY KEY,
    acheteur_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    boutique_id INTEGER NOT NULL ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(acheteur_id, boutique_id)
);

CREATE TABLE recommandations_boutiques (
    id SERIAL PRIMARY KEY,
    boutique_id INTEGER NOT NULL,
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    ordre_affichage INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    date_debut DATE,
    date_fin DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (boutique_id) REFERENCES boutiques(id) ON DELETE CASCADE
);

-- ============================================================================
-- TABLE 9: categories_produits
-- Catégories des produits
-- ============================================================================
CREATE TABLE categories_produits (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE 10: produits
-- Produits des boutiques
-- ============================================================================
CREATE TABLE produits (
    id SERIAL PRIMARY KEY,
    boutique_id INTEGER NOT NULL,
    categorie_id INTEGER,
    nom_produit VARCHAR(200) NOT NULL,
    description TEXT,
    prix DECIMAL(10,2) NOT NULL,
    prix_promotionnel DECIMAL(10,2),
    reference_produit VARCHAR(100),
    image_principale VARCHAR(500),
    images_supplementaires JSONB DEFAULT '[]'::jsonb,
    
    -- Stock
    quantite_stock INTEGER DEFAULT 0,
    seuil_alerte_stock INTEGER DEFAULT 5,
    
    -- Statistiques
    nombre_ventes INTEGER DEFAULT 0,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (boutique_id) REFERENCES boutiques(id) ON DELETE CASCADE,
    FOREIGN KEY (categorie_id) REFERENCES categories_produits(id) ON DELETE SET NULL
);

-- ============================================================================
-- TABLE 11: emplacements_stock
-- Lieux de stockage des produits
-- ============================================================================
CREATE TABLE emplacements_stock (
    id SERIAL PRIMARY KEY,
    boutique_id INTEGER NOT NULL,
    nom_emplacement VARCHAR(100) NOT NULL,
    description TEXT,
    capacite_max INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (boutique_id) REFERENCES boutiques(id) ON DELETE CASCADE
);

-- ============================================================================
-- TABLE 12: stocks
-- Gestion détaillée du stock par emplacement
-- ============================================================================
CREATE TABLE stocks (
    id SERIAL PRIMARY KEY,
    produit_id INTEGER NOT NULL,
    emplacement_id INTEGER NOT NULL,
    quantite INTEGER NOT NULL DEFAULT 0,
    date_derniere_entree TIMESTAMP,
    date_derniere_sortie TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE,
    FOREIGN KEY (emplacement_id) REFERENCES emplacements_stock(id) ON DELETE CASCADE,
    
    UNIQUE(produit_id, emplacement_id)
);

-- ============================================================================
-- TABLE 13: promotions
-- Gestion des promotions (Page Promotions Acheteurs)
-- ============================================================================
CREATE TABLE promotions (
    id SERIAL PRIMARY KEY,
    produit_id INTEGER NOT NULL,
    titre_promotion VARCHAR(200) NOT NULL,
    description TEXT,
    pourcentage_reduction DECIMAL(5,2),
    prix_promotion DECIMAL(10,2),
    date_debut TIMESTAMP NOT NULL,
    date_fin TIMESTAMP NOT NULL,
    quantite_limitee INTEGER,
    quantite_restante INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE
);

-- ============================================================================
-- TABLE 14: produits_enregistres
-- Produits enregistrés par les acheteurs (Bouton enregistrement)
-- ============================================================================
CREATE TABLE produits_enregistres (
    id SERIAL PRIMARY KEY,
    acheteur_id INTEGER NOT NULL,
    produit_id INTEGER NOT NULL,
    promotion_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (acheteur_id) REFERENCES acheteurs(id) ON DELETE CASCADE,
    FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE,
    FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE SET NULL,
    
    UNIQUE(acheteur_id, produit_id)
);

-- ============================================================================
-- TABLE 15: ventes
-- Historique des ventes (Tableau de bord Boutiques)
-- ============================================================================
CREATE TABLE ventes (
    id SERIAL PRIMARY KEY,
    boutique_id INTEGER NOT NULL,
    produit_id INTEGER NOT NULL,
    acheteur_id INTEGER,
    quantite INTEGER NOT NULL,
    prix_unitaire DECIMAL(10,2) NOT NULL,
    prix_total DECIMAL(10,2) NOT NULL,
    date_vente TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reference_vente VARCHAR(100) UNIQUE,
    
    FOREIGN KEY (boutique_id) REFERENCES boutiques(id) ON DELETE CASCADE,
    FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE,
    FOREIGN KEY (acheteur_id) REFERENCES acheteurs(id) ON DELETE SET NULL
);

-- ============================================================================
-- TABLE 16: discussions_forums
-- Discussions du forum (Page Forums Acheteurs)
-- ============================================================================
CREATE TABLE discussions_forums (
    id SERIAL PRIMARY KEY,
    acheteur_id INTEGER NOT NULL,
    titre VARCHAR(255) NOT NULL,
    contenu TEXT NOT NULL,
    statut VARCHAR(20) DEFAULT 'ouvert' CHECK (statut IN ('ouvert', 'ferme', 'epingle')),
    nombre_vues INTEGER DEFAULT 0,
    nombre_commentaires INTEGER DEFAULT 0,
    is_epingle BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (acheteur_id) REFERENCES acheteurs(id) ON DELETE CASCADE
);

-- ============================================================================
-- TABLE 17: commentaires_forums
-- Commentaires des discussions (Espace commentaire Forums)
-- ============================================================================
CREATE TABLE commentaires_forums (
    id SERIAL PRIMARY KEY,
    discussion_id INTEGER NOT NULL,
    acheteur_id INTEGER NOT NULL,
    contenu TEXT NOT NULL,
    parent_commentaire_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (discussion_id) REFERENCES discussions_forums(id) ON DELETE CASCADE,
    FOREIGN KEY (acheteur_id) REFERENCES acheteurs(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_commentaire_id) REFERENCES commentaires_forums(id) ON DELETE CASCADE
);

-- ============================================================================
-- TABLE 18: events
-- Gestion des événements (CRUD Events Boutiques + Validation Admin)
-- ============================================================================
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    boutique_id INTEGER NOT NULL,
    titre VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    date_debut TIMESTAMP NOT NULL,
    date_fin TIMESTAMP NOT NULL,
    lieu VARCHAR(255),
    image_event VARCHAR(500),
    capacite_max INTEGER,
    nombre_participants INTEGER DEFAULT 0,
    
    -- Validation Admin
    statut VARCHAR(20) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'valide', 'refuse', 'termine', 'annule')),
    valide_par_admin_id INTEGER,
    date_validation TIMESTAMP,
    motif_refus TEXT,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (boutique_id) REFERENCES boutiques(id) ON DELETE CASCADE,
    FOREIGN KEY (valide_par_admin_id) REFERENCES admins(id) ON DELETE SET NULL
);

-- ============================================================================
-- TABLE 19: participants_events
-- Participation aux événements (Bouton Participer)
-- ============================================================================
CREATE TABLE participants_events (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL,
    acheteur_id INTEGER NOT NULL,
    statut_participation VARCHAR(20) DEFAULT 'confirme' CHECK (statut_participation IN ('confirme', 'annule', 'liste_attente')),
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (acheteur_id) REFERENCES acheteurs(id) ON DELETE CASCADE,
    
    UNIQUE(event_id, acheteur_id)
);

-- ============================================================================
-- TABLE 20: contrats_loyers
-- Contrats de location des boutiques
-- ============================================================================
CREATE TABLE contrats_loyers (
    id SERIAL PRIMARY KEY,
    boutique_id INTEGER NOT NULL,
    montant_mensuel DECIMAL(10,2) NOT NULL,
    jour_echeance INTEGER NOT NULL CHECK (jour_echeance BETWEEN 1 AND 31),
    date_debut_contrat DATE NOT NULL,
    date_fin_contrat DATE,
    depot_garantie DECIMAL(10,2),
    conditions_particulieres TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (boutique_id) REFERENCES boutiques(id) ON DELETE CASCADE
);

-- ============================================================================
-- TABLE 21: paiements_loyers
-- Paiements des loyers (Liste paiements payé/impayé)
-- ============================================================================
CREATE TABLE paiements_loyers (
    id SERIAL PRIMARY KEY,
    contrat_id INTEGER NOT NULL,
    boutique_id INTEGER NOT NULL,
    mois_concerne DATE NOT NULL,
    montant_du DECIMAL(10,2) NOT NULL,
    montant_paye DECIMAL(10,2) DEFAULT 0,
    statut VARCHAR(20) DEFAULT 'impaye' CHECK (statut IN ('paye', 'impaye', 'en_retard', 'partiel')),
    
    -- Paiement
    date_paiement TIMESTAMP,
    mode_paiement VARCHAR(50),
    reference_paiement VARCHAR(100),
    
    -- Retard
    nombre_jours_retard INTEGER DEFAULT 0,
    penalite_retard DECIMAL(10,2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (contrat_id) REFERENCES contrats_loyers(id) ON DELETE CASCADE,
    FOREIGN KEY (boutique_id) REFERENCES boutiques(id) ON DELETE CASCADE,
    
    UNIQUE(boutique_id, mois_concerne)
);

-- ============================================================================
-- TABLE 22: factures_loyers
-- Factures de loyers (Impression Facture)
-- ============================================================================
CREATE TABLE factures_loyers (
    id SERIAL PRIMARY KEY,
    paiement_id INTEGER UNIQUE NOT NULL,
    numero_facture VARCHAR(50) UNIQUE NOT NULL,
    date_emission DATE NOT NULL,
    montant_ht DECIMAL(10,2),
    montant_tva DECIMAL(10,2),
    montant_ttc DECIMAL(10,2) NOT NULL,
    fichier_pdf VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (paiement_id) REFERENCES paiements_loyers(id) ON DELETE CASCADE
);

-- ============================================================================
-- TABLE 23: relances_loyers
-- Relances automatiques paiement loyers (Notifications Admin)
-- ============================================================================
CREATE TABLE relances_loyers (
    id SERIAL PRIMARY KEY,
    paiement_id INTEGER NOT NULL,
    boutique_id INTEGER NOT NULL,
    type_relance VARCHAR(50) NOT NULL,
    date_relance TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message TEXT,
    envoye_par VARCHAR(50),
    is_lu BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (paiement_id) REFERENCES paiements_loyers(id) ON DELETE CASCADE,
    FOREIGN KEY (boutique_id) REFERENCES boutiques(id) ON DELETE CASCADE
);

-- ============================================================================
-- TABLE 24: notifications
-- Notifications clients (Events boutiques favoris, etc.)
-- ============================================================================
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    destinataire_id INTEGER NOT NULL,
    type_notification VARCHAR(50) NOT NULL CHECK (type_notification IN ('event', 'promotion', 'loyer', 'validation', 'general')),
    titre VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    lien_action VARCHAR(500),
    
    -- Origine
    boutique_id INTEGER,
    event_id INTEGER,
    promotion_id INTEGER,
    
    is_lu BOOLEAN DEFAULT FALSE,
    date_lu TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (boutique_id) REFERENCES boutiques(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE CASCADE
);

-- ============================================================================
-- FIN DES CREATE TABLE
-- ============================================================================