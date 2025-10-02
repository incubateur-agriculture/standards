# Système de Cache TTL

## Vue d'ensemble

Le système de cache TTL (Time To Live) est une implémentation intelligente de mise en cache avec expiration automatique des données. Il est utilisé pour optimiser les performances en évitant les appels API répétés.

## Fonctionnalités

### TtlCache<TKey, TValue>

Classe générique de cache avec les fonctionnalités suivantes :

- **TTL configurable** : Chaque entrée expire après un délai défini
- **Nettoyage automatique** : Les entrées expirées sont supprimées automatiquement
- **Opérations thread-safe** : Gestion sécurisée des accès concurrents
- **Méthodes utilitaires** : Accès aux clés et valeurs valides

### Configuration des TTL

- **Cache des identifiants** : 10 minutes (600 000 ms)
- **Cache complet** : 15 minutes (900 000 ms)

## Utilisation

### Cache des identifiants d'outils

```typescript
import { mappingCache } from '@/infrastructure/grist/utils/cache'

// Définir une valeur
mappingCache.set(1, 'identifiant-outil-1')

// Récupérer une valeur
const identifiant = mappingCache.get(1) // 'identifiant-outil-1'

// Vérifier l'existence
const exists = mappingCache.has(1) // true

// Obtenir la taille du cache
const size = mappingCache.size() // 1
```

### Cache complet des mappings

```typescript
import { fullMappingCache } from '@/infrastructure/grist/utils/cache'

// Définir un mapping complet
fullMappingCache.set(1, { id: 1, identifiantOutil: 'identifiant-1' })

// Récupérer un mapping
const mapping = fullMappingCache.get(1)

// Obtenir toutes les valeurs valides
const allMappings = fullMappingCache.getValidValues()
```

## Avantages

### Performance
- **Réduction des appels API** : Les données sont mises en cache localement
- **Accès rapide** : O(1) pour les opérations de lecture
- **Nettoyage automatique** : Pas de fuite mémoire

### Flexibilité
- **TTL configurable** : Adaptable aux besoins de chaque cas d'usage
- **Types génériques** : Réutilisable pour différents types de données
- **API simple** : Interface intuitive et facile à utiliser

### Fiabilité
- **Gestion des expirations** : Les données obsolètes sont automatiquement supprimées
- **Thread-safe** : Gestion sécurisée des accès concurrents
- **Tests complets** : Couverture de test exhaustive

## Stratégie de cache

### Double niveau de cache

1. **Cache des identifiants** (`mappingCache`)
   - Stocke uniquement les identifiants d'outils
   - TTL : 10 minutes
   - Utilisé pour les accès fréquents aux identifiants

2. **Cache complet** (`fullMappingCache`)
   - Stocke les objets MappingProduitHebergement complets
   - TTL : 15 minutes
   - Utilisé pour les opérations sur les mappings complets

### Stratégie de remplissage

1. **Premier accès** : Chargement depuis l'API Grist
2. **Mise en cache** : Stockage dans les deux caches
3. **Accès suivants** : Lecture depuis le cache approprié
4. **Expiration** : Nettoyage automatique des entrées expirées

## Monitoring

### Statistiques du cache

```typescript
import { getCacheStats } from '@/infrastructure/grist/repositories/mappingProduitHebergementGristRepository'

const stats = getCacheStats()
console.log(`Cache identifiants: ${stats.mappingCacheSize} entrées`)
console.log(`Cache complet: ${stats.fullMappingCacheSize} entrées`)
```

### Nettoyage manuel

```typescript
import { clearMappingCache } from '@/infrastructure/grist/repositories/mappingProduitHebergementGristRepository'

// Vider tous les caches
clearMappingCache()
```

## Tests

Le système de cache est entièrement testé avec :

- **Tests unitaires** : Fonctionnalités de base de TtlCache
- **Tests d'intégration** : Comportement avec les repositories
- **Tests de performance** : Gestion des accès concurrents
- **Tests d'expiration** : Vérification du TTL

## Configuration recommandée

### Environnement de développement
- TTL court (1-2 minutes) pour voir les changements rapidement

### Environnement de production
- TTL plus long (10-15 minutes) pour optimiser les performances
- Monitoring des statistiques de cache
- Nettoyage périodique si nécessaire
