## El Shaddai Fragrances — Plan de construction

Boutique de parfums en français, structure inspirée de lattafa-usa.com, rebrandée avec ton logo Art Déco "El Shaddai Fragrances". Catalogue avec produits de démonstration (remplaçables), panier fonctionnel, commande envoyée par email.

### Identité visuelle

- **Logo** : ton symbole Art Déco noir et or (utilisé tel quel dans le header, le footer et le favicon)
- **Nom affiché** : El Shaddai Fragrances / El Shaddai Boutique
- **Téléphone** : 076 546 24 25 (cliquable `tel:`)
- **Email** : ambargonzalez_20@gmail.com (cliquable `mailto:`)
- **Palette claire et élégante**, alignée sur le logo :
  - Fond principal : ivoire `#FBF8F3`
  - Surfaces cartes : blanc cassé `#FFFFFF`
  - Texte : noir profond `#0F0F0F`
  - Accent or principal : `#C9A24C` (le doré du logo)
  - Or clair / highlight : `#E8D196`
  - Bordures fines : `#E8E2D6`
- **Typographie** : titres en sérif élégant style Art Déco (Cormorant Garamond ou Italiana), corps en sans-serif fin (Inter / Jost) — lisibles, beaucoup d'espace, fines lignes dorées comme séparateurs

### Animations sur les fiches produits (cartes "cadre du parfum")

Chaque carte produit a un cadre fin doré qui s'anime au survol / au tap mobile :
- **Cadre doré** : trait fin qui se dessine progressivement aux 4 coins (effet "corner reveal" Art Déco)
- **Flacon** : léger zoom (scale 1.04) + ombre douce dorée qui apparaît sous le flacon
- **Reflet diagonal** : passage lumineux subtil qui traverse le flacon (shimmer)
- **Texte** : nom du parfum qui glisse vers le haut, prix qui apparaît en fondu, petit bouton "Ajouter" qui slide en bas
- **Mobile** : mêmes animations déclenchées au `:active`/tap, pas seulement au hover
- Animations fluides (300-500ms, ease-out), pas envahissantes

### Pages (routes TanStack)

- `/` Accueil — bandeau d'annonce défilante, hero plein écran avec logo et claim, "Nouveautés", "Best-sellers", "Collections", bloc valeurs, footer
- `/boutique` Catalogue complet (filtres collection + prix)
- `/boutique/$slug` Fiche produit (galerie, description, contenance, "Ajouter au panier")
- `/collections` + `/collections/$slug`
- `/nouveautes`, `/best-sellers`
- `/a-propos`
- `/contact` (tél + email + formulaire)
- `/panier`
- `/commande` (formulaire client → envoi email)
- `/commande/confirmation`

Header sticky transparent → opaque au scroll, avec ton logo à gauche, navigation centrée, icônes recherche + panier (badge quantité) à droite. Footer ivoire avec logo, coordonnées cliquables, liens et mentions, fines lignes dorées.

### Panier + commande par email

- Panier persisté en `localStorage` (zustand + persist)
- Drawer panier (shadcn Sheet) accessible depuis l'icône header
- Page `/commande` : formulaire validé (zod + react-hook-form) — nom, email, téléphone, adresse complète, ville, code postal, notes
- Au submit, une server function envoie un email récapitulatif à **ambargonzalez_20@gmail.com** :
  - Coordonnées client
  - Détail des articles (nom, contenance, quantité, prix unitaire, total ligne)
  - Total général
- Email de confirmation au client
- Redirection vers `/commande/confirmation`, panier vidé

### Produits de démonstration

- 12 parfums codés en dur dans `src/data/products.ts` (noms évocateurs orientaux/élégants, prix en CHF, descriptions, notes olfactives, contenances 50ml/100ml, catégorie)
- Visuels : flacons élégants générés (fonds ivoires/dorés/noirs)
- Structure typée pour remplacement facile quand tu fourniras ta vraie liste

### Détails techniques

- **Frontend** : TanStack Start, Tailwind v4, shadcn/ui (Button, Card, Sheet, Dialog, Form, Input, Sonner)
- **State panier** : zustand + persist
- **Validation** : zod + react-hook-form
- **Email** : Lovable Cloud + Lovable Emails (templates React Email "nouvelle-commande" et "confirmation-commande")
- **Logo** : intégré via Lovable Assets depuis ton upload, utilisé en header/footer/favicon/OG image
- **Tokens design** : palette ivoire/or/noir dans `src/styles.css` (oklch)
- **Animations cartes** : Tailwind + keyframes custom dans `styles.css` (corner-draw, shimmer, lift)
- **SEO** : `head()` propre par route (titre FR, description, og:title/description)

### Prérequis à activer pendant le build

1. **Lovable Cloud** — pour l'envoi d'emails
2. **Domaine email** — pour que les commandes partent depuis une adresse pro (fallback dashboard sinon)

### Hors périmètre

- Pas de paiement en ligne
- Pas de back-office admin (produits dans le code, je te montrerai où les modifier)
- Pas de compte client / login
- Pas de gestion de stock temps réel
