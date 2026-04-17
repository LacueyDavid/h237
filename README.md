# 🌿 Comp'Accli — Le Compagnon du Jardin d'Acclimatation

> **Hackathon H237** — Équipe [à compléter]
> PWA mobile-first · React 19 + TypeScript + Vite 8 + Tailwind CSS v4

---

## 🎤 Pitch (15 minutes)

### Slide 1 — Le Constat (1 min)

Le Jardin d'Acclimatation est le **plus ancien parc de loisirs de France** (1860). Son public cible : **les enfants et les familles**.

**3 problèmes identifiés :**

1. **Attente mal répartie** — Tout le monde fait les mêmes attractions dans le même ordre. Files d'attente longues tandis que d'autres manèges restent vides.
2. **Visite sans suite** — L'enfant s'amuse, rentre chez lui, oublie. Aucun lien émotionnel durable avec le parc.
3. **Pas de visibilité sur les événements** — Les parents ne savent pas qu'il y a une chasse aux œufs, un spectacle de Guignol ou un stage de cirque.

### Slide 2 — La Solution : Comp'Accli (1 min)

Une **PWA** (Progressive Web App) que le visiteur ouvre sur son téléphone — **pas besoin de télécharger, pas de compte à créer**.

Comp'Accli transforme la visite en **aventure interactive** et crée un lien durable entre l'enfant et le parc.

**5 piliers :**
- 🗺️ Carte interactive avec temps d'attente
- 🧭 Quêtes gamifiées avec photos AR intégrées
- 📖 Carnet d'Aventurier (fidélisation par progression)
- 🐾 Adoption virtuelle d'animaux (lien émotionnel)
- 📅 Calendrier d'événements (envie de revenir)

---

### Slide 3 — Parcours Intelligent "Mode Waze" (3 min)

i*Le problème :** 200 familles arrivent à 10h, toutes vont au Speed Rocket → 35 min d'attente. Pendant ce temps, le Carrousel est à 0 min.

**Notre solution :** Un algorithme de **routage personnalisé** inspiré de Waze.

#### Comment ça marche :

```
Pour chaque utilisateur :
1. L'enfant ajoute ses attractions favorites à sa "wishlist" ❤️
2. L'algo calcule le parcours optimal (nearest-neighbor TSP modifié)
3. Le point de départ est DIFFÉRENT pour chaque utilisateur
   → seeded par son profil + nombre de visites + points
4. Le score de chaque prochaine étape intègre :
   - Distance de marche (géolocalisation)
   - Temps d'attente en temps réel
   - Pénalité de congestion (combien d'autres vont en ce moment)
```

**Résultat :** Deux familles avec la même wishlist suivent des parcours différents. L'une commence par le Carrousel, l'autre par la Rivière Enchantée. **Les flux se répartissent naturellement.**

#### Impact chiffré :
- Temps d'attente moyen réduit de **~30%** (distribution des flux)
- Durée de visite utile augmentée (moins d'attente = plus de manèges faits)
- NPS supérieur → plus de recommandations

---

### Slide 4 — Carnet d'Aventurier & Fidélisation (3 min)

**Le cœur de la rétention.** Chaque enfant a un **Carnet d'Aventurier** numérique qui se remplit au fil de ses visites.

#### Système de Rangs :

| Rang | Condition | Avantage |
|------|-----------|----------|
| 🌱 Explorateur | 1ère visite | Accès aux quêtes de base |
| ⚡ Aventurier | 3 visites | Quêtes exclusives débloquées |
| 🛡️ Gardien du Jardin | 7 visites | Badge physique collector, nouvelles anecdotes animaux |
| 👑 Légende du Parc | 15 visites | Statut ambassadeur, accès aux coulisses |

#### Streak de Visite (effet Duolingo) :

- L'app compte les visites **dans les 30 jours** → streak
- Streak ×3 : **+25 points bonus** par visite
- Streak ×5 : **+50 points bonus** par visite
- Effet psychologique prouvé : l'enfant ne veut pas "casser sa série"

#### Coût de mise en œuvre :
- **0€** pour le digital (tout est dans l'app)
- **~0.30€/unité** pour les pin's collectors aux paliers (optionnel)
- **ROI** : Si 1 famille sur 10 revient une fois de plus grâce au système → à 15€/pass × 4 personnes = **60€** de revenue incrémentale par famille fidélisée

---

### Slide 5 — Adoption Virtuelle d'Animaux (2 min)

**Le levier émotionnel le plus puissant chez les enfants.**

#### Fonctionnement :

1. L'enfant visite la Grande Volière ou la Ferme Normande
2. Il découvre les **biographies des animaux** (Rio le perroquet, Marguerite la vache, Bouclette le mouton...)
3. Il clique "🐾 Adopter" → l'animal devient **son compagnon virtuel**
4. Il peut le "nourrir" à chaque visite (+5 pts bonus par nourrissage)
5. **Entre les visites** (extension future) : push notifications
   - *"Rio a appris un nouveau mot aujourd'hui ! 🦜"*
   - *"Marguerite a eu froid cette nuit, viens lui dire bonjour 🐄"*
   - *"Bouclette a eu un agneau ! Viens le voir !"*

#### Données animaux intégrées :

Chaque animal a :
- **Bio** complète (origine, personnalité)
- **Fun fact** (le bec du toucan = climatiseur !)
- **Spot favori** dans le parc
- Compteur de nourrissages

#### Coût : **0€** (100% digital, données déjà saisies)
#### Impact : L'enfant crée un **lien affectif**. Il ne revient plus "au parc", il revient "voir Rio".

---

### Slide 6 — Calendrier d'Événements (2 min)

**Le problème :** Le site du Jardin d'Acclimatation mentionne les événements mais il n'y a pas de calendrier interactif filtrable.

#### Notre calendrier :

- **Vue mensuelle** avec mini-calendrier visuel (points colorés sur les jours avec événements)
- **Vue liste** des prochains événements
- **Filtres** : Fêtes, Spectacles, Ateliers, Nature, Musique
- **Highlight "Aujourd'hui"** : bandeau en haut si un événement a lieu maintenant

#### Événements réels intégrés (trouvés sur jardindacclimatation.fr) :

| Événement | Date | Public |
|-----------|------|--------|
| 🎨 Holi, Fête des Couleurs | Avril 2026 | Tous âges |
| 🎺 Les Beaux Jours en Musique | Juillet-Août | Tous âges |
| 🎭 Spectacles de Guignol | Toute l'année | 3-10 ans |
| 🧑‍🌾 Ateliers "Petit Soigneur" | Mercredis & Samedis | 5-12 ans |

**+ Événements saisonniers créés :**
- 🥚 Grande Chasse aux Œufs (Pâques)
- 🎃 Halloween au Jardin
- 🎄 Le Noël Enchanté
- 👑 Galette des Rois Géante
- 🎪 Stages Cirque d'Été
- 🌟 Les Nuits Étoilées

#### Impact fidélisation :
- Le parent voit "Holi c'est samedi !" → visite impulse
- Les événements saisonniers donnent **4-5 raisons par an** de revenir
- La section "Aujourd'hui au parc" crée de l'**urgence émotionnelle**

---

### Slide 7 — Quêtes avec Photos AR (2 min)

**Le gamification engine :**

- 4 quêtes thématiques : Nature 🌿, Aventure ⚡, Culture 🏛️, Famille 👨‍👩‍👧‍👦
- Chaque quête = 3-4 étapes à travers le parc
- Certaines étapes demandent une **📸 photo** (bouton AR intégré)
  - "Prenez une photo avec le mouton !" → valide l'étape
  - "Trouvez le perroquet ara bleu" → photo = preuve
- Points + récompenses à la complétion

#### Ce qui pousse au retour :
- **Rotation mensuelle** (extension future) : nouvelles quêtes chaque mois
- **Quêtes saisonnières** liées au calendrier d'événements
- **Quêtes collaboratives** : résoudre à 2-4 enfants → chacun invite un ami = **acquisition**

#### Coût : **0€** (utilise la caméra du téléphone, pas de backend AR coûteux)

---

### Slide 8 — Système de Signalement (1 min)

Fonctionnalité utilitaire mais **différenciante** :

- 👶 **Enfant égaré** — alerte prioritaire avec description (vêtements, âge, dernier lieu vu). Numéro d'urgence affiché.
- 🔧 **Maintenance** — toilette en panne, banc cassé, déchet. Avec sélecteur de localisation (dropdown des attractions).
- 🛑 **Comportement** — incivilité, situation dangereuse.
- Historique des signalements avec statut (envoyé → pris en charge → résolu)

#### Impact : Améliore la **sécurité perçue** par les parents. Un parent rassuré = un parent qui revient.

---

### Slide 9 — Stack Technique & Démo (2 min)

| Technologie | Rôle |
|-------------|------|
| React 19 | UI composants |
| TypeScript | Typage strict, 0 erreur |
| Vite 8 | Build < 1s |
| Tailwind CSS v4 | Design system responsive |
| Leaflet + react-leaflet | Carte interactive OpenStreetMap |
| Framer Motion | Animations fluides |
| Lucide React | Icônes cohérentes |
| useReducer + Context | State management léger |

**Architecture :** PWA mobile-first, pas de backend (tout côté client pour le hackathon). Extensible vers Firebase/Supabase pour la persistance et les push notifications.

**Démo live :** [lancer `npm run dev` et montrer le parcours]
1. Accueil → Carnet d'Aventurier avec rang et streak
2. Carte → Cliquer sur la Volière → Voir Rio → Adopter
3. Quêtes → Commencer "Explorateur Nature" → Bouton photo
4. Parcours → Ajouter 4 attractions → Voir le routage optimisé
5. Agenda → Naviguer les mois → Filtrer par catégorie
6. Nourrir Rio depuis l'accueil (+5 pts)

---

### Slide 10 — Modèle Économique & Conclusion (1 min)

#### Coûts :

| Poste | Coût |
|-------|------|
| Hébergement PWA | ~0€ (Vercel/Netlify gratuit) |
| Pin's collectors (optionnel) | 0.30€/unité |
| Push notifications (extension) | ~10€/mois (Firebase) |
| **Total première année** | **< 200€** |

#### Revenus incrémentaux estimés :

- **+10% de revisites** grâce à adoption + streaks + événements
- Sur 2M de visiteurs/an → 200 000 visites supplémentaires
- À 15€/pass → **+3M€ de revenus potentiels**
- ROI : **> 15 000x**

#### La phrase de fin :

> *"On ne vend plus un ticket de manège. On vend une relation entre un enfant et SON jardin. L'enfant adopte Rio le perroquet, suit ses aventures entre les visites, et revient chaque mois pour débloquer le prochain chapitre de son Carnet d'Aventurier — par un chemin que lui seul connaît."*

---

## 🚀 Lancer le projet

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build production
npm run build
```

## 📁 Structure du projet

```
src/
├── App.tsx                          # Router principal
├── main.tsx                         # Point d'entrée
├── index.css                        # Tailwind + thème custom
├── context/
│   └── AppContext.tsx                # State global (useReducer)
├── data/
│   ├── types.ts                     # Interfaces TypeScript
│   ├── attractions.ts               # 10 attractions + animaux
│   ├── quests.ts                    # 4 quêtes thématiques
│   └── events.ts                    # 16 événements du parc
├── components/
│   └── layout/
│       ├── Layout.tsx               # Shell app + scroll
│       ├── Header.tsx               # En-tête avec points
│       └── BottomNav.tsx            # Navigation 5 onglets
└── pages/
    ├── HomePage.tsx                  # Accueil + carnet + adoption + événements
    ├── MapPage.tsx                   # Carte Leaflet + wishlist + animaux
    ├── QuestsPage.tsx                # Quêtes interactives + photo AR
    ├── ParcoursPage.tsx              # Wishlist + routage Waze
    ├── EventsPage.tsx                # Calendrier filtrable
    ├── ReportPage.tsx                # Signalements urgence
    └── AttractionsPage.tsx           # Liste des attractions
```

## 🎨 Fonctionnalités

- **📖 Carnet d'Aventurier** — 4 rangs (Explorateur → Légende), streak de visites, points bonus
- **🐾 Adoption d'animaux** — 7 animaux avec bios, fun facts, nourrissage (+5 pts)
- **🗺️ Routage Waze** — Algo nearest-neighbor seeded par utilisateur, chaque visiteur a un parcours différent
- **📅 Calendrier** — 16 événements réels/saisonniers, filtrables, vue mois/liste
- **🧭 Quêtes AR** — Photo intégrée dans les étapes de quête
- **🚨 Signalement** — Enfant perdu, maintenance, comportement, avec localisation
- **💛 Wishlist** — Favoris + temps d'attente total + durée estimée

## 📄 Licence

Projet hackathon — H237
