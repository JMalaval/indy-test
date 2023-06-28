# Test Technique Indy

L'énoncé du test se trouve [ici](https://indyfr.notion.site/Test-technique-Indy-a2ebf77d34b04fb698242c72bcdbdaec)


## Choix Technique

J'ai choisi le Framework NestJS pour sa rapidité d'initialisation d'un projet avec déjà beaucoup de choses en place pour un code propre et structuré. J'ai une connaissance limitée du Framework et surtout de l'architecture, ce qui m'a ralenti, mais m'a donné un cadre propre.

J'ai directement utilisé une base de données, même s'il était précisé dans l'énoncé que ce n'était pas obligatoire, car cela m'a permis d'aller plus vite, car je maîtrise bien Mongoose et l'écriture de Schemas. De plus, cela m'a aidé à structurer ma réflexion.

J'ai également connecté le service à Atlas en créant un utilisateur temporaire (qui expirera dans 1 semaine), ce qui rend le code testable localement.

## Respect du délai

J'ai perdu beaucoup de temps en raison de problèmes de compréhension des dépendances internes liées à NestJS. J'ai donc pris un peu plus de temps que prévu, car je ne voulais pas rendre un code qui ne fonctionne même pas. 

Je n'ai pas non plus pris en compte le temps nécessaire pour rédiger le Readme dans le temps imparti.

## Améliorations

### Pistes d'amélioration possibles :

- Augmenter le nombre de tests :
  - Il serait judicieux de tester le Controller pour s'assurer du bon fonctionnement du validateur de schema.
  - Il serait également possible d'augmenter le nombre de tests du service pour couvrir toutes les possibilités.
- Améliorer l'organisation du code, notamment dans le service, car j'ai placé ma logique pour l'algorithme dans le fichier qui devient un peu volumineux et peu lisible.
- Ajouter une configuration pour ne pas laisser les apiKey visible.
- Meilleur système de gestion d'erreur car actuellement c'est sommaire notamment ce qui est retourné dans `reasons`
- Améliorer le typage de l'API de météo, en particulier pour le champ weather, car je n'ai pas l'énumération avec le bon nom. Il serait peut-être préférable d'utiliser plutôt l'identifiant, ce qui serait plus simple.
- Créer un DockerFile pour run une base de donnée en local afin de faire tourner les tests et ne pas utiliser la base de donnée distante

### Problématiques rencontrés :

Je suis parti sur une solution trop compliqué pour l'implémentation de l'algorithme ce qui m'as fait perdre du temps et je n'ai pas réussit à gérer aussi bien les erreur que je l'aurais voulu.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```