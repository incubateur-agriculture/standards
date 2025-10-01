import { describe, it, expect, vi, beforeEach } from 'vitest'
import { findAllOutilsMutualises, findAllOutilsNonMutualises, editOutilsStartupsMapping, deleteOutilsStartupsMapping } from '../outilsGristRepository'
import { apiClient } from '@/infrastructure/grist/client/gristApiClient'
import { GRIST } from '@/infrastructure/grist/constants/gristConstants'
import { Produit, OutilsStartupsMapping } from '@/domain/types'

vi.mock('@/infrastructure/grist/client/gristApiClient', () => ({
  apiClient: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn()
  }
}))

describe('outilsGristRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('findAllOutilsMutualises', () => {
    it('should return empty array when no mutualised tools found', async () => {
      // Arrange
      vi.mocked(apiClient.get).mockResolvedValue({ data: { records: [] } })

      // Act
      const result = await findAllOutilsMutualises()

      // Assert
      expect(result).toEqual([])
      expect(apiClient.get).toHaveBeenCalledWith(
        `/tables/${GRIST.PRODUITS_ET_OUTILS.ID}/records`,
        {
          params: {
            filter: `{"${GRIST.PRODUITS_ET_OUTILS.FIELDS.TYPE}": ["Outil"], "${GRIST.PRODUITS_ET_OUTILS.FIELDS.MUTUALISE}": [true]}`
          }
        }
      )
    })

    it('should return mapped mutualised tools when found', async () => {
      // Arrange
      const mockGristOutils = [
        {
          id: 1,
          fields: {
            [GRIST.PRODUITS_ET_OUTILS.FIELDS.NOM]: 'Matomo'
          }
        },
        {
          id: 2,
          fields: {
            [GRIST.PRODUITS_ET_OUTILS.FIELDS.NOM]: 'Sentry'
          }
        }
      ]
      const expectedProduits: Produit[] = [
        { id: 1, nom: 'Matomo' },
        { id: 2, nom: 'Sentry' }
      ]
      vi.mocked(apiClient.get).mockResolvedValue({ data: { records: mockGristOutils } })

      // Act
      const result = await findAllOutilsMutualises()

      // Assert
      expect(result).toEqual(expectedProduits)
      expect(apiClient.get).toHaveBeenCalledWith(
        `/tables/${GRIST.PRODUITS_ET_OUTILS.ID}/records`,
        {
          params: {
            filter: `{"${GRIST.PRODUITS_ET_OUTILS.FIELDS.TYPE}": ["Outil"], "${GRIST.PRODUITS_ET_OUTILS.FIELDS.MUTUALISE}": [true]}`
          }
        }
      )
    })

    it('should handle single mutualised tool', async () => {
      // Arrange
      const mockGristOutil = {
        id: 1,
        fields: {
          [GRIST.PRODUITS_ET_OUTILS.FIELDS.NOM]: 'Matomo'
        }
      }
      const expectedProduit: Produit = { id: 1, nom: 'Matomo' }
      vi.mocked(apiClient.get).mockResolvedValue({ data: { records: [mockGristOutil] } })

      // Act
      const result = await findAllOutilsMutualises()

      // Assert
      expect(result).toEqual([expectedProduit])
    })
  })

  describe('findAllOutilsNonMutualises', () => {
    it('should return empty array when no non-mutualised tools found', async () => {
      // Arrange
      vi.mocked(apiClient.get).mockResolvedValue({ data: { records: [] } })

      // Act
      const result = await findAllOutilsNonMutualises()

      // Assert
      expect(result).toEqual([])
      expect(apiClient.get).toHaveBeenCalledWith(
        `/tables/${GRIST.PRODUITS_ET_OUTILS.ID}/records`,
        {
          params: {
            filter: `{"${GRIST.PRODUITS_ET_OUTILS.FIELDS.TYPE}": ["Outil"], "${GRIST.PRODUITS_ET_OUTILS.FIELDS.MUTUALISE}": [false]}`
          }
        }
      )
    })

    it('should return mapped non-mutualised tools when found', async () => {
      // Arrange
      const mockGristOutils = [
        {
          id: 3,
          fields: {
            [GRIST.PRODUITS_ET_OUTILS.FIELDS.NOM]: 'Custom Tool 1'
          }
        },
        {
          id: 4,
          fields: {
            [GRIST.PRODUITS_ET_OUTILS.FIELDS.NOM]: 'Custom Tool 2'
          }
        }
      ]
      const expectedProduits: Produit[] = [
        { id: 3, nom: 'Custom Tool 1' },
        { id: 4, nom: 'Custom Tool 2' }
      ]
      vi.mocked(apiClient.get).mockResolvedValue({ data: { records: mockGristOutils } })

      // Act
      const result = await findAllOutilsNonMutualises()

      // Assert
      expect(result).toEqual(expectedProduits)
      expect(apiClient.get).toHaveBeenCalledWith(
        `/tables/${GRIST.PRODUITS_ET_OUTILS.ID}/records`,
        {
          params: {
            filter: `{"${GRIST.PRODUITS_ET_OUTILS.FIELDS.TYPE}": ["Outil"], "${GRIST.PRODUITS_ET_OUTILS.FIELDS.MUTUALISE}": [false]}`
          }
        }
      )
    })

    it('should handle single non-mutualised tool', async () => {
      // Arrange
      const mockGristOutil = {
        id: 3,
        fields: {
          [GRIST.PRODUITS_ET_OUTILS.FIELDS.NOM]: 'Custom Tool'
        }
      }
      const expectedProduit: Produit = { id: 3, nom: 'Custom Tool' }
      vi.mocked(apiClient.get).mockResolvedValue({ data: { records: [mockGristOutil] } })

      // Act
      const result = await findAllOutilsNonMutualises()

      // Assert
      expect(result).toEqual([expectedProduit])
    })
  })

  describe('API error handling', () => {
    it('should propagate API errors for mutualised tools', async () => {
      // Arrange
      const error = new Error('API Error')
      vi.mocked(apiClient.get).mockRejectedValue(error)

      // Act & Assert
      await expect(findAllOutilsMutualises()).rejects.toThrow('API Error')
    })

    it('should propagate API errors for non-mutualised tools', async () => {
      // Arrange
      const error = new Error('API Error')
      vi.mocked(apiClient.get).mockRejectedValue(error)

      // Act & Assert
      await expect(findAllOutilsNonMutualises()).rejects.toThrow('API Error')
    })
  })

  describe('Data mapping edge cases', () => {
    it('should handle tools with missing nom field', async () => {
      // Arrange
      const mockGristOutils = [
        {
          id: 1,
          fields: {
            [GRIST.PRODUITS_ET_OUTILS.FIELDS.NOM]: undefined
          }
        }
      ]
      vi.mocked(apiClient.get).mockResolvedValue({ data: { records: mockGristOutils } })

      // Act
      const result = await findAllOutilsMutualises()

      // Assert
      expect(result).toEqual([{ id: 1, nom: '' }])
    })

    it('should handle tools with empty nom field', async () => {
      // Arrange
      const mockGristOutils = [
        {
          id: 1,
          fields: {
            [GRIST.PRODUITS_ET_OUTILS.FIELDS.NOM]: ''
          }
        }
      ]
      vi.mocked(apiClient.get).mockResolvedValue({ data: { records: mockGristOutils } })

      // Act
      const result = await findAllOutilsMutualises()

      // Assert
      expect(result).toEqual([{ id: 1, nom: '' }])
    })

    it('should handle tools with null fields', async () => {
      // Arrange
      const mockGristOutils = [
        {
          id: 1,
          fields: null
        }
      ]
      vi.mocked(apiClient.get).mockResolvedValue({ data: { records: mockGristOutils } })

      // Act
      const result = await findAllOutilsMutualises()

      // Assert
      expect(result).toEqual([{ id: 1, nom: '' }])
    })
  })

  describe('Filter validation', () => {
    it('should use correct filter for mutualised tools', async () => {
      // Arrange
      vi.mocked(apiClient.get).mockResolvedValue({ data: { records: [] } })

      // Act
      await findAllOutilsMutualises()

      // Assert
      expect(apiClient.get).toHaveBeenCalledWith(
        `/tables/${GRIST.PRODUITS_ET_OUTILS.ID}/records`,
        {
          params: {
            filter: `{"${GRIST.PRODUITS_ET_OUTILS.FIELDS.TYPE}": ["Outil"], "${GRIST.PRODUITS_ET_OUTILS.FIELDS.MUTUALISE}": [true]}`
          }
        }
      )
    })

    it('should use correct filter for non-mutualised tools', async () => {
      // Arrange
      vi.mocked(apiClient.get).mockResolvedValue({ data: { records: [] } })

      // Act
      await findAllOutilsNonMutualises()

      // Assert
      expect(apiClient.get).toHaveBeenCalledWith(
        `/tables/${GRIST.PRODUITS_ET_OUTILS.ID}/records`,
        {
          params: {
            filter: `{"${GRIST.PRODUITS_ET_OUTILS.FIELDS.TYPE}": ["Outil"], "${GRIST.PRODUITS_ET_OUTILS.FIELDS.MUTUALISE}": [false]}`
          }
        }
      )
    })
  })

  describe('editOutilsStartupsMapping', () => {
    it('should update an existing mapping successfully', async () => {
      // Arrange
      const mapping: OutilsStartupsMapping = {
        id: 1,
        startupId: 10,
        outilId: 20,
        usage: 'Développement'
      }
      
      const mockGristResponse = {
        data: {
          records: [{
            id: 1,
            fields: {
              [GRIST.OUTILS_STARTUPS.FIELDS.STARTUP]: 10,
              [GRIST.OUTILS_STARTUPS.FIELDS.OUTIL]: 20,
              [GRIST.OUTILS_STARTUPS.FIELDS.USAGE]: 'Développement'
            }
          }]
        }
      }
      
      vi.mocked(apiClient.put).mockResolvedValue(mockGristResponse)

      // Act
      const result = await editOutilsStartupsMapping(mapping)

      // Assert
      expect(result).toBeUndefined()
      expect(apiClient.put).toHaveBeenCalledWith(
        `/tables/${GRIST.OUTILS_STARTUPS.ID}/records`,
        {
          records: [{
            id: 1,
            require: {
              [GRIST.OUTILS_STARTUPS.FIELDS.STARTUP]: 10,
              [GRIST.OUTILS_STARTUPS.FIELDS.OUTIL]: 20,
            },
            fields: {
              [GRIST.OUTILS_STARTUPS.FIELDS.USAGE]: 'Développement'
            }
          }]
        }
      )
    })

    it('should create a new mapping when no id is provided', async () => {
      // Arrange
      const mapping: OutilsStartupsMapping = {
        startupId: 15,
        outilId: 25,
        usage: 'Production'
      }
      
      const mockGristResponse = {
        data: {
          records: [{
            id: 2,
            fields: {
              [GRIST.OUTILS_STARTUPS.FIELDS.STARTUP]: 15,
              [GRIST.OUTILS_STARTUPS.FIELDS.OUTIL]: 25,
              [GRIST.OUTILS_STARTUPS.FIELDS.USAGE]: 'Production'
            }
          }]
        }
      }
      
      vi.mocked(apiClient.put).mockResolvedValue(mockGristResponse)

      // Act
      const result = await editOutilsStartupsMapping(mapping)

      // Assert
      expect(result).toBeUndefined()
      expect(apiClient.put).toHaveBeenCalledWith(
        `/tables/${GRIST.OUTILS_STARTUPS.ID}/records`,
        {
          records: [{
            require: {
              [GRIST.OUTILS_STARTUPS.FIELDS.STARTUP]: 15,
              [GRIST.OUTILS_STARTUPS.FIELDS.OUTIL]: 25,
            },
            fields: {
              [GRIST.OUTILS_STARTUPS.FIELDS.USAGE]: 'Production'
            }
          }]
        }
      )
    })

    it('should handle API errors', async () => {
      // Arrange
      const mapping: OutilsStartupsMapping = {
        id: 1,
        startupId: 10,
        outilId: 20,
        usage: 'Développement'
      }
      
      const error = new Error('API Error')
      vi.mocked(apiClient.put).mockRejectedValue(error)

      // Act & Assert
      await expect(editOutilsStartupsMapping(mapping)).rejects.toThrow('API Error')
    })

    it('should handle empty usage string', async () => {
      // Arrange
      const mapping: OutilsStartupsMapping = {
        id: 1,
        startupId: 10,
        outilId: 20,
        usage: ''
      }
      
      const mockGristResponse = {
        data: {
          records: [{
            id: 1,
            fields: {
              [GRIST.OUTILS_STARTUPS.FIELDS.STARTUP]: 10,
              [GRIST.OUTILS_STARTUPS.FIELDS.OUTIL]: 20,
              [GRIST.OUTILS_STARTUPS.FIELDS.USAGE]: ''
            }
          }]
        }
      }
      
      vi.mocked(apiClient.put).mockResolvedValue(mockGristResponse)

      // Act
      const result = await editOutilsStartupsMapping(mapping)

      // Assert
      expect(result).toBeUndefined()
    })

    it('should handle special characters in usage', async () => {
      // Arrange
      const mapping: OutilsStartupsMapping = {
        id: 1,
        startupId: 10,
        outilId: 20,
        usage: 'Développement & Tests (v2.0)'
      }
      
      const mockGristResponse = {
        data: {
          records: [{
            id: 1,
            fields: {
              [GRIST.OUTILS_STARTUPS.FIELDS.STARTUP]: 10,
              [GRIST.OUTILS_STARTUPS.FIELDS.OUTIL]: 20,
              [GRIST.OUTILS_STARTUPS.FIELDS.USAGE]: 'Développement & Tests (v2.0)'
            }
          }]
        }
      }
      
      vi.mocked(apiClient.put).mockResolvedValue(mockGristResponse)

      // Act
      const result = await editOutilsStartupsMapping(mapping)

      // Assert
      expect(result).toBeUndefined()
    })
  })

  describe('deleteOutilsStartupsMapping', () => {
    it('should delete a mapping successfully', async () => {
      // Arrange
      const mappingId = 1
      const mockGristResponse = { data: {} }
      
      vi.mocked(apiClient.post).mockResolvedValue(mockGristResponse)

      // Act
      const result = await deleteOutilsStartupsMapping(mappingId)

      // Assert
      expect(result).toBeUndefined()
      expect(apiClient.post).toHaveBeenCalledWith(
        `/tables/${GRIST.OUTILS_STARTUPS.ID}/data/delete`,
        [mappingId]
      )
    })

    it('should handle API errors during deletion', async () => {
      // Arrange
      const mappingId = 1
      const error = new Error('API Error')
      vi.mocked(apiClient.post).mockRejectedValue(error)

      // Act & Assert
      await expect(deleteOutilsStartupsMapping(mappingId)).rejects.toThrow('API Error')
    })

    it('should handle multiple mapping deletions', async () => {
      // Arrange
      const mappingIds = [1, 2, 3]
      const mockGristResponse = { data: {} }
      
      vi.mocked(apiClient.post).mockResolvedValue(mockGristResponse)

      // Act
      for (const mappingId of mappingIds) {
        await deleteOutilsStartupsMapping(mappingId)
      }

      // Assert
      expect(apiClient.post).toHaveBeenCalledTimes(3)
      expect(apiClient.post).toHaveBeenNthCalledWith(1, `/tables/${GRIST.OUTILS_STARTUPS.ID}/data/delete`, [1])
      expect(apiClient.post).toHaveBeenNthCalledWith(2, `/tables/${GRIST.OUTILS_STARTUPS.ID}/data/delete`, [2])
      expect(apiClient.post).toHaveBeenNthCalledWith(3, `/tables/${GRIST.OUTILS_STARTUPS.ID}/data/delete`, [3])
    })

    it('should handle zero mapping ID', async () => {
      // Arrange
      const mappingId = 0
      const mockGristResponse = { data: {} }
      
      vi.mocked(apiClient.post).mockResolvedValue(mockGristResponse)

      // Act
      const result = await deleteOutilsStartupsMapping(mappingId)

      // Assert
      expect(result).toBeUndefined()
      expect(apiClient.post).toHaveBeenCalledWith(
        `/tables/${GRIST.OUTILS_STARTUPS.ID}/data/delete`,
        [0]
      )
    })
  })
})
