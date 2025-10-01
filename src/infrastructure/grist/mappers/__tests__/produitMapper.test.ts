import { describe, it, expect } from 'vitest'
import { mapGristProduitToProduit, GristProduit } from '../produitMapper'
import { GRIST } from '@/infrastructure/grist/constants/gristConstants'
import { Produit } from '@/domain/types'

describe('produitMapper', () => {
  describe('mapGristProduitToProduit', () => {
    it('should correctly map a Grist produit to a domain Produit', () => {
      // Arrange
      const gristProduit: GristProduit = {
        id: 123,
        fields: {
          [GRIST.PRODUITS.FIELDS.NOM]: 'Test Product',
          [GRIST.PRODUITS.FIELDS.STARTUP_ID]: 123,
          [GRIST.PRODUITS.FIELDS.STATUT]: 'En construction',
          [GRIST.PRODUITS.FIELDS.TYPE_PROJET]: 'Application',
          [GRIST.PRODUITS.FIELDS.ARCHITECTURE]: 'Monolithique',
          [GRIST.PRODUITS.FIELDS.LANGUAGES]: ['L', 'TypeScript', 'JavaScript'],
          [GRIST.PRODUITS.FIELDS.DESCRIPTION]: 'Test description',
          [GRIST.PRODUITS.FIELDS.REPOSITORY]: 'https://github.com/test/repo',
          [GRIST.PRODUITS.FIELDS.HOMEPAGE]: 'https://test.com',
          [GRIST.PRODUITS.FIELDS.DEPENDANCES]: ['L', 'React', 'NextJS'],
          [GRIST.PRODUITS.FIELDS.OUTILS_MUTUALISES]: ['L', 'Matomo', 'Sentry'],
          [GRIST.PRODUITS.FIELDS.OUTILS_NON_MUTUALISES]: ['L', 'Custom Tool'],
          [GRIST.PRODUITS.FIELDS.HEBERGEMENT]: ['L', 'Scalingo'],
          [GRIST.PRODUITS.FIELDS.FRONTEND]: ['L', 'React'],
          [GRIST.PRODUITS.FIELDS.BACKEND]: ['L', 'NodeJS'],
          [GRIST.PRODUITS.FIELDS.AUTHENTIFICATION]: ['L', 'OAuth']
        }
      }

      // Act
      const result = mapGristProduitToProduit(gristProduit)

      // Assert
      const expected: Produit = {
        id: 123,
        nom: 'Test Product',
        startupId: 123,
        statut: 'En construction',
        typeProjet: 'Application',
        architecture: 'Monolithique',
        languages: ['TypeScript', 'JavaScript'],
        description: 'Test description',
        repository: 'https://github.com/test/repo',
        homepage: 'https://test.com',
        dependances: ['React', 'NextJS'],
        outilsMutualises: ['Matomo', 'Sentry'],
        outilsNonMutualises: ['Custom Tool'],
        hebergement: ['Scalingo'],
        frontend: ['React'],
        backend: ['NodeJS'],
        authentification: ['OAuth']
      }
      expect(result).toEqual(expected)
    })

    it('should handle undefined array fields by returning empty arrays', () => {
      // Arrange
      const gristProduit: GristProduit = {
        id: 123,
        fields: {
          [GRIST.PRODUITS.FIELDS.NOM]: 'Test Product',
          [GRIST.PRODUITS.FIELDS.STARTUP_ID]: 123,
          [GRIST.PRODUITS.FIELDS.STATUT]: 'En construction',
          [GRIST.PRODUITS.FIELDS.TYPE_PROJET]: 'Application',
          [GRIST.PRODUITS.FIELDS.ARCHITECTURE]: 'Monolithique',
          [GRIST.PRODUITS.FIELDS.DESCRIPTION]: 'Test description',
          [GRIST.PRODUITS.FIELDS.REPOSITORY]: 'https://github.com/test/repo',
          [GRIST.PRODUITS.FIELDS.HOMEPAGE]: 'https://test.com'
          // Other array fields are intentionally missing
        }
      }

      // Act
      const result = mapGristProduitToProduit(gristProduit)

      // Assert
      expect(result.languages).toEqual([])
      expect(result.dependances).toEqual([])
      expect(result.outilsMutualises).toEqual([])
      expect(result.outilsNonMutualises).toEqual([])
      expect(result.hebergement).toEqual([])
      expect(result.frontend).toEqual([])
      expect(result.backend).toEqual([])
      expect(result.authentification).toEqual([])
    })

    it('should handle arrays without the "L" prefix', () => {
      // Arrange
      const gristProduit: GristProduit = {
        id: 123,
        fields: {
          [GRIST.PRODUITS.FIELDS.NOM]: 'Test Product',
          [GRIST.PRODUITS.FIELDS.STARTUP_ID]: 123,
          [GRIST.PRODUITS.FIELDS.STATUT]: 'En construction',
          [GRIST.PRODUITS.FIELDS.TYPE_PROJET]: 'Application',
          [GRIST.PRODUITS.FIELDS.ARCHITECTURE]: 'Monolithique',
          [GRIST.PRODUITS.FIELDS.LANGUAGES]: ['TypeScript', 'JavaScript'], // No 'L' prefix
          [GRIST.PRODUITS.FIELDS.DESCRIPTION]: 'Test description',
          [GRIST.PRODUITS.FIELDS.REPOSITORY]: 'https://github.com/test/repo',
          [GRIST.PRODUITS.FIELDS.HOMEPAGE]: 'https://test.com'
        }
      }

      // Act
      const result = mapGristProduitToProduit(gristProduit)

      // Assert
      expect(result.languages).toEqual(['TypeScript', 'JavaScript'])
    })
  })
}) 