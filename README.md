# PokéNuxt

Application web Pokémon développée avec Nuxt, permettant de consulter, rechercher et gérer sa collection de Pokémon.

## Fonctionnalités

- **Pokédex** — Liste complète des Pokémon avec recherche avancée par génération, type, favoris, et plus encore
- **Fiche Pokémon** — Accès aux détails de chaque Pokémon
- **Favoris** — Possibilité de marquer un Pokémon comme favori
- **Équipe** — Ajout d'un Pokémon capturé à son équipe avec formulaire de personnalisation (surnom, etc.)
- **Types** — Tableau récapitulatif des types avec leurs faiblesses et résistances

## Liste des liens
- http://localhost:3000/ -> Accueil / Pokédex
- http://localhost:3000/pokemon/:id -> Fiche Pokémon
- http://localhost:3000/favorites -> Favoris
- http://localhost:3000/team -> Équipe
- http://localhost:3000/types -> Types

## Prérequis

- [Node.js](https://nodejs.org/) v18 ou supérieur
- [npm](https://www.npmjs.com/) v9 ou supérieur

## Installation

```bash
npm install
```

## Développement

Lance le serveur de développement sur `http://localhost:3000` :

```bash
npm run dev
```

## Production

Compile l'application pour la production :

```bash
npm run build
```

Prévisualise le build de production localement :

```bash
npm run preview
```

## Auteurs

- [Iles ASMA](https://github.com/Iles-Asma)
- [Florent MENUS](https://github.com/FloMenus)
- [Tom DEPUSSAY](https://github.com/tomdepussay)