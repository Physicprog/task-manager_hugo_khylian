# Système de Drag & Drop avec DnD Kit

## Installation

Le système utilise les packages suivants :
- `@dnd-kit/core` : Core functionality
- `@dnd-kit/sortable` : Composants triables
- `@dnd-kit/utilities` : Utilitaires

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

## Architecture

### 1. CardList.jsx (Container principal)
- Contient le `DndContext` qui gère tous les événements de drag & drop
- Gère les événements `onDragStart`, `onDragOver`, et `onDragEnd`
- Utilise `DragOverlay` pour afficher l'élément en cours de déplacement

### 2. Column.jsx (Zone de dépôt)
- Utilise `useDroppable` pour être une zone de dépôt valide
- Contient un `SortableContext` pour gérer l'ordre des cartes
- Stratégie de tri : `verticalListSortingStrategy`

### 3. Card.jsx (Élément déplaçable)
- Utilise `useSortable` pour être déplaçable et triable
- Géré l'état visuel pendant le déplacement (opacity, transform)
- Support des données contextuelles pour identifier le type d'élément

## Fonctionnalités

### Déplacement de cartes
1. **Dans la même colonne** : Réorganisation de l'ordre
2. **Vers une autre colonne** : Changement de colonne + position
3. **Vers une colonne vide** : Ajout en première position

### Sauvegarde automatique
- Les changements sont immédiatement reflétés dans l'UI
- Sauvegarde automatique en base de données via l'API
- Gestion des erreurs avec rollback automatique
- Notifications utilisateur pour les succès/erreurs

## API Backend

### Nouvelle méthode : moveCard()
```javascript
export async function moveCard(cardId, targetColumnId, position = 0) {
    // Met à jour la colonne et la position d'une carte
}
```

### Méthode updateCard() mise à jour
Supporte maintenant :
- `columnId` : Changement de colonne
- `position` : Position dans la colonne
- `favorite` : Statut favori

## Styles CSS

Fichier : `src/styles/dragdrop.css`

### Classes disponibles
- `.dragging` : Style pendant le déplacement
- `.drag-overlay` : Style de l'overlay
- `.drop-indicator` : Indicateur de zone de dépôt
- `.sortable-dropzone` : Transition des zones

## Mode Template

Le système fonctionne également en mode template :
- Changements uniquement en mémoire
- Pas de sauvegarde backend
- Notifications adaptées

## Gestion d'erreurs

- Mise à jour UI immédiate pour une meilleure UX
- Sauvegarde backend en arrière-plan
- Rollback automatique en cas d'erreur
- Notifications d'état pour l'utilisateur

## Configuration DnD Kit

### Sensors
- `PointerSensor` avec distance d'activation de 3px
- Évite les déplacements accidentels

### Collision Detection
- `closestCorners` : Meilleur algorithme pour les grilles
- Gestion précise des zones de survol

### Stratégies de tri
- Colonnes : `horizontalListSortingStrategy`
- Cartes : `verticalListSortingStrategy`