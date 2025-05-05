# Mahjong Canvas Game

Un jeu de Mahjong solitaire implémenté en JavaScript utilisant un `<canvas>` pour le rendu.


## Description

Ce projet propose un clone simple de Mahjong solitaire avec :

* Plusieurs formes de plateau (pyramide, goomba, muraille).
* Reconnaissance des paires classiques et paires spéciales fleurs/saisons.
* Timer, système de score, malus de mélange et multiplicateur selon le temps.
* Options de pause et d’indication de paires après inactivité.



## Structure du projet

```
/ (racine)
├─ index.html                 # Page principale contenant le canvas et UI et Page des règles intégrée en popup
├─audio
│  └─ background.mp3          # Background sonore du jeu 
├─ css/
│  └─ style.css               # Styles globaux et popup de règles
├─ js/
│  ├─ script.js               #  gestion du canvas et UI
│  ├─ Game.js                 # Classe principale du jeu
│  ├─ ObjectGraphique.js      # Gére la création des tuiles
│  ├─ Map.js                  # Génération et rendu des tuiles
│  └─maps/                    # Dossier comprenant les maps
├─ images/                    # Dossiers d’images pour les tuiles et le fond
└─ README.md                  # Ce fichier
```

## Utilisation

* Sélectionner une forme de plateau dans la liste déroulante.
* Cliquer sur **Mélanger Tuiles** pour remélanger au prix de -200 points.
* Cliquer sur deux tuiles libres pour les associer.
* Cliquer sur **Pause** dans le canvas pour stopper le timer et désactiver les clics.

## Contrôles

| Élément             | Action                               |
| ------------------- | ------------------------------------ |
| Clic sur tuile      | Sélection/removal de paires          |
| Bouton **Pause**    | Met en pause          |
| Bouton **Mélanger** | Remélange les tuiles (-200 pts)      |
| Sélecteur de carte  | Change de forme sans rafraîchir page |

## Règles du jeu

1. Le plateau est composé de plusieurs niveaux (pyramide, goomba, muraille).
2. Une tuile est **libre** si elle n’est pas couverte et qu’elle a au moins un côté gauche ou droit dégagé.
3. Cliquer sur deux tuiles libres formant une paire valide pour les retirer.
4. Paires valides : deux tuiles identiques **ou** une fleur + sa saison correspondante.
5. La partie se termine quand toutes les tuiles sont retirées.

## Système de score

* **Paire trouvée** : +100 points
* **Combo rapide** : si la paire suivante est trouvée en <5s, +150 points
* **Mélange manuel** : -200 points
* **Multiplicateur final** selon temps total :

  | Temps écoulé | Multiplicateur |
  | ------------ | -------------- |
  | < 4 min      | x4             |
  | 4–6 min      | x3.5           |
  | 6–8 min      | x3             |
  | 8–10 min     | x2.5           |
  | 10–12 min    | x2             |
  | ≥ 12 min     | x1.5           |

## Options avancées

* **Indices** : après 20 s d’inactivité, une case bleue s’affiche autour d’une paire disponible (désactivable via checkbox).
* **Popup Règles** : accessible sans recharger la partie.
* **Pause** : désactive tout clic et met le timer en pause.


