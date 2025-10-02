# Audit Technique - Incubateur des Territoires

Bienvenue dans l'outil d'audit technique de l'incubateur des territoires. Cet outil permet d'évaluer les startups pour les préparer aux comités d'investissement. L'objectif de l'audit est de rendre visible la dette technique et de garantir la pérennité des produits numériques développés.

Cette application est construite avec **Next.js** et utilise **react-dsfr** pour l'intégration des composants de l'interface utilisateur. Elle est déployée sur la plateforme **Scalingo**, avec une gestion des questions, catégories et réponses via **Grist**.

## Fonctionnalités

- **Audit structuré** : Répondre à un ensemble de questions pour évaluer les aspects techniques des startups.
- **Commentaires personnalisés** : Les utilisateurs peuvent fournir des explications lorsqu'ils répondent "Non" à certaines questions.
- **Gestion des données via Grist** : Utilisation d'un document **Grist** pour stocker les questions d'audit, leurs catégories et les réponses.
- **Interface utilisateur moderne** : Utilisation de **react-dsfr** pour un design conforme aux standards administratifs.

## Prérequis

- **Node.js** (~24)
- **Grist** pour la gestion des données
- (Optionnel) **N8N** pour l'automatisation du process d'audit

## Déploiement rapide

[![Deploy to Scalingo](https://cdn.scalingo.com/deploy/button.svg)](https://my.scalingo.com/deploy?source=https://github.com/incubateur-territoires/survey-builder)

Cliquez sur le bouton ci-dessus pour déployer l'application en un clic sur Scalingo. Vous devrez configurer les variables d'environnement suivantes :

- **GRIST_URL** : URL de votre API Grist (ex: `https://grist.incubateur.anct.gouv.fr/api`)
- **GRIST_API_KEY** : Votre clé API Grist
- **GRIST_DOC_ID** : L'ID du document Grist contenant les données d'audit

Les autres variables (Sentry, Matomo) sont optionnelles.

## Installation locale

1. Copiez le fichier d'exemple de configuration `.env.template` en `.env.local` :
   ```bash
   cp .env.template .env.local # Configure here your Grist server URL, API Key and doc ID
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Lancez l'application en mode développement :
   ```bash
   npm run dev
   ```

## Intégration avec Grist

L'application utilise Grist pour gérer les données d'audit. Suivez ces étapes pour configurer l'accès à l'API Grist :

1. Générez un token API sur votre compte Grist.
2. Ajoutez les informations suivantes dans votre fichier `.env.local` :

   ```bash
   GRIST_URL=https://grist.incubateur.anct.gouv.fr/api
   GRIST_API_KEY=your_grist_api_key
   GRIST_DOC_ID=your_grist_doc_id
   ```

L'application utilise Grist comme backend pour gérer les données d'audit. Grist centralise les questions, catégories et réponses dans un document dédié, permettant une gestion fluide et structurée des audits techniques.

Ce document Grist est préconfiguré pour fonctionner avec l'application. Un exemple exporté est disponible dans le dossier `templates/` de ce dépôt et peut être importé dans votre compte Grist. Il contient un ensemble de questions et un produit de test pour faciliter la mise en place de l'outil en local.

Le process pour réaliser un audit est documenté sur le Notion de l'incubateur des territoires : https://incubateurdesterritoires.notion.site/Audits-techniques-Processus-11f744bf03dd80c490cccdf316fe0248

## Intégration avec N8N (Optionnelle)

Des automatisations sont disponibles pour gérer les envois de mail d'audit et de recommandations, un template est disponible dans le dossier `templates/` de ce dépôt pour l'importer dans votre repository

## Intégration avec Sentry (Optionnelle)
Vous pouvez configurer Sentry via les variables d'environnement

## Intégration avec Matomo (Optionnelle)
Vous pouvez configurer Matomo via les variables d'environnement

## Processus de publication

### Contribuer

Clonez le projet localement, créez une branche dédiée pour votre fonctionnalité, codez, testez et poussez votre branche.  
Créez ensuite une merge request.

### Déploiement en staging

Lorsque la merge request est fusionnée, le déploiement sur l'environnement de staging est automatique via le pipeline GitLab CI.

### Déploiement en production

Une fois les tests en staging validés, [accédez aux pipelines](https://gitlab.com/incubateur-territoires/incubateur/survey-builder/-/pipelines) et cliquez sur le bouton "play" pour créer une release, générer un tag et déclencher le déploiement en production.

## Contribution

Avant de contribuer, installez et configurez [Talisman](https://github.com/thoughtworks/talisman) en pre-commit pour vous protéger contre les divulgation malencontreuses de secrets.

Les contributions sont les bienvenues ! Soumettez une pull request avec une description de vos modifications.

Idéalement le nouveau code devrait être couvert par des tests (Playwright & Vitest sont configurés) et ne pas dégrader le score sonarcloud (Sonar vous fait un retour sur votre Pull Request en la commentant)

## Licence

Ce projet est sous licence MIT. Consultez le fichier [LICENSE](./LICENSE) pour plus d'informations.
