import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
  getProduitById, 
  getAllProduits, 
  saveProduit,
  getOutilsMutualisesOptions,
  getOutilsNonMutualisesOptions
} from '../produitRepository'
import { 
  findProduitById as findGristProduitById,
  findAllProduits as findAllGristProduits,
  saveProduit as saveGristProduit
} from '@/infrastructure/grist/repositories/produitsGristRepository'
import {
  fetchOutilsMutualisesOptions as fetchGristOutilsMutualisesOptions,
  fetchOutilsNonMutualisesOptions as fetchGristOutilsNonMutualisesOptions
} from '@/infrastructure/grist/repositories/columnsGristRepository'
import { Produit, ColumnOption } from '@/domain/types'

// Mock the dependencies
vi.mock('@/infrastructure/grist/repositories/produitsGristRepository', () => ({
  findProduitById: vi.fn(),
  findAllProduits: vi.fn(),
  saveProduit: vi.fn()
}))

vi.mock('@/infrastructure/grist/repositories/columnsGristRepository', () => ({
  fetchOutilsMutualisesOptions: vi.fn(),
  fetchOutilsNonMutualisesOptions: vi.fn()
}))

describe('produitRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getProduitById', () => {
    it('should call findGristProduitById with correct ID and return the result', async () => {
      // Arrange
      const produitId = 123
      const mockProduit: Produit = {
        id: produitId,
        nom: 'Test Product',
        startupId: 123,
        statut: 'En construction',
        typeProjet: 'Application',
        architecture: 'Monolithique',
        languages: ['TypeScript'],
        description: 'Test description',
        repository: 'https://github.com/test/repo',
        homepage: 'https://test.com',
        dependances: ['React'],
        outilsMutualises: ['Matomo'],
        outilsNonMutualises: ['Custom Tool'],
        hebergement: ['Scalingo'],
        frontend: ['React'],
        backend: ['NodeJS'],
        authentification: ['OAuth']
      }
      
      vi.mocked(findGristProduitById).mockResolvedValueOnce(mockProduit)

      // Act
      const result = await getProduitById(produitId)

      // Assert
      expect(findGristProduitById).toHaveBeenCalledWith(produitId)
      expect(result).toEqual(mockProduit)
    })

    it('should return null when findGristProduitById returns null', async () => {
      // Arrange
      const produitId = 999
      vi.mocked(findGristProduitById).mockResolvedValueOnce(null)

      // Act
      const result = await getProduitById(produitId)

      // Assert
      expect(findGristProduitById).toHaveBeenCalledWith(produitId)
      expect(result).toBeNull()
    })
  })

  describe('getAllProduits', () => {
    it('should call findAllGristProduits and return the result', async () => {
      // Arrange
      const mockProduits: Produit[] = [
        {
          id: 1,
          nom: 'Product 1',
          startupId: 1,
          statut: 'En construction',
          typeProjet: 'Application',
          architecture: 'Monolithique',
          languages: ['TypeScript'],
          description: 'Description 1',
          repository: 'https://github.com/test/repo1',
          homepage: 'https://test1.com',
          dependances: ['React'],
          outilsMutualises: ['Matomo'],
          outilsNonMutualises: [],
          hebergement: ['Scalingo'],
          frontend: ['React'],
          backend: ['NodeJS'],
          authentification: ['OAuth']
        },
        {
          id: 2,
          nom: 'Product 2',
          startupId: 2,
          statut: 'En production',
          typeProjet: 'API',
          architecture: 'Microservices',
          languages: ['JavaScript'],
          description: 'Description 2',
          repository: 'https://github.com/test/repo2',
          homepage: 'https://test2.com',
          dependances: ['Express'],
          outilsMutualises: ['Sentry'],
          outilsNonMutualises: ['Custom Tool'],
          hebergement: ['AWS'],
          frontend: [],
          backend: ['Express'],
          authentification: ['JWT']
        }
      ]
      
      vi.mocked(findAllGristProduits).mockResolvedValueOnce(mockProduits)

      // Act
      const result = await getAllProduits()

      // Assert
      expect(findAllGristProduits).toHaveBeenCalled()
      expect(result).toEqual(mockProduits)
    })
  })

  describe('saveProduit', () => {
    it('should call saveGristProduit with the provided produit', async () => {
      // Arrange
      const produit: Produit = {
        id: 123,
        nom: 'Test Product',
        startupId: 123,
        statut: 'En construction',
        typeProjet: 'Application',
        architecture: 'Monolithique',
        languages: ['TypeScript'],
        description: 'Test description',
        repository: 'https://github.com/test/repo',
        homepage: 'https://test.com',
        dependances: ['React'],
        outilsMutualises: ['Matomo'],
        outilsNonMutualises: ['Custom Tool'],
        hebergement: ['Scalingo'],
        frontend: ['React'],
        backend: ['NodeJS'],
        authentification: ['OAuth']
      }
      
      vi.mocked(saveGristProduit).mockResolvedValueOnce()

      // Act
      await saveProduit(produit)

      // Assert
      expect(saveGristProduit).toHaveBeenCalledWith(produit)
    })

    it('should throw an error when saveGristProduit throws', async () => {
      // Arrange
      const produit: Produit = {
        id: 123,
        nom: 'Test Product',
        startupId: 123,
        statut: 'En construction',
        typeProjet: 'Application',
        architecture: 'Monolithique',
        languages: ['TypeScript'],
        description: 'Test description',
        repository: 'https://github.com/test/repo',
        homepage: 'https://test.com',
        dependances: ['React'],
        outilsMutualises: ['Matomo'],
        outilsNonMutualises: ['Custom Tool'],
        hebergement: ['Scalingo'],
        frontend: ['React'],
        backend: ['NodeJS'],
        authentification: ['OAuth']
      }
      
      vi.mocked(saveGristProduit).mockRejectedValueOnce(new Error('Save error'))

      // Act & Assert
      await expect(saveProduit(produit)).rejects.toThrow('Save error')
    })
  })

  describe('getOutilsMutualisesOptions', () => {
    it('should call fetchGristOutilsMutualisesOptions and return the result', async () => {
      // Arrange
      const mockOptions: ColumnOption[] = [
        { id: 'matomo', label: 'Matomo' },
        { id: 'sentry', label: 'Sentry' }
      ]
      
      vi.mocked(fetchGristOutilsMutualisesOptions).mockResolvedValueOnce(mockOptions)

      // Act
      const result = await getOutilsMutualisesOptions()

      // Assert
      expect(fetchGristOutilsMutualisesOptions).toHaveBeenCalled()
      expect(result).toEqual(mockOptions)
    })
  })

  describe('getOutilsNonMutualisesOptions', () => {
    it('should call fetchGristOutilsNonMutualisesOptions and return the result', async () => {
      // Arrange
      const mockOptions: ColumnOption[] = [
        { id: 'custom1', label: 'Custom Tool 1' },
        { id: 'custom2', label: 'Custom Tool 2' }
      ]
      
      vi.mocked(fetchGristOutilsNonMutualisesOptions).mockResolvedValueOnce(mockOptions)

      // Act
      const result = await getOutilsNonMutualisesOptions()

      // Assert
      expect(fetchGristOutilsNonMutualisesOptions).toHaveBeenCalled()
      expect(result).toEqual(mockOptions)
    })
  })
}) 