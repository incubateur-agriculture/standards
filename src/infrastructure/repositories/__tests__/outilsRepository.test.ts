import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
  getAllOutilsMutualises, 
  getAllOutilsNonMutualises,
  editOutilsStartupsMapping,
  deleteOutilsStartupsMapping
} from '../outilsRepository'
import { 
  findAllOutilsMutualises as findAllGristOutilsMutualises,
  findAllOutilsNonMutualises as findAllGristOutilsNonMutualises,
  editOutilsStartupsMapping as editGristOutilsStartupsMapping,
  deleteOutilsStartupsMapping as deleteGristOutilsStartupsMapping
} from '@/infrastructure/grist/repositories/outilsGristRepository'
import { Produit, OutilsStartupsMapping } from '@/domain/types'

// Mock the dependencies
vi.mock('@/infrastructure/grist/repositories/outilsGristRepository', () => ({
  findAllOutilsMutualises: vi.fn(),
  findAllOutilsNonMutualises: vi.fn(),
  editOutilsStartupsMapping: vi.fn(),
  deleteOutilsStartupsMapping: vi.fn()
}))

describe('outilsRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllOutilsMutualises', () => {
    it('should call findAllGristOutilsMutualises and return the result', async () => {
      // Arrange
      const mockOutils: Produit[] = [
        { id: 1, nom: 'Matomo' },
        { id: 2, nom: 'Sentry' }
      ]
      
      vi.mocked(findAllGristOutilsMutualises).mockResolvedValueOnce(mockOutils)

      // Act
      const result = await getAllOutilsMutualises()

      // Assert
      expect(findAllGristOutilsMutualises).toHaveBeenCalled()
      expect(result).toEqual(mockOutils)
    })

    it('should return empty array when findAllGristOutilsMutualises returns empty array', async () => {
      // Arrange
      vi.mocked(findAllGristOutilsMutualises).mockResolvedValueOnce([])

      // Act
      const result = await getAllOutilsMutualises()

      // Assert
      expect(findAllGristOutilsMutualises).toHaveBeenCalled()
      expect(result).toEqual([])
    })

    it('should throw an error when findAllGristOutilsMutualises throws', async () => {
      // Arrange
      vi.mocked(findAllGristOutilsMutualises).mockRejectedValueOnce(new Error('API Error'))

      // Act & Assert
      await expect(getAllOutilsMutualises()).rejects.toThrow('API Error')
    })
  })

  describe('getAllOutilsNonMutualises', () => {
    it('should call findAllGristOutilsNonMutualises and return the result', async () => {
      // Arrange
      const mockOutils: Produit[] = [
        { id: 3, nom: 'Custom Tool 1' },
        { id: 4, nom: 'Custom Tool 2' }
      ]
      
      vi.mocked(findAllGristOutilsNonMutualises).mockResolvedValueOnce(mockOutils)

      // Act
      const result = await getAllOutilsNonMutualises()

      // Assert
      expect(findAllGristOutilsNonMutualises).toHaveBeenCalled()
      expect(result).toEqual(mockOutils)
    })

    it('should return empty array when findAllGristOutilsNonMutualises returns empty array', async () => {
      // Arrange
      vi.mocked(findAllGristOutilsNonMutualises).mockResolvedValueOnce([])

      // Act
      const result = await getAllOutilsNonMutualises()

      // Assert
      expect(findAllGristOutilsNonMutualises).toHaveBeenCalled()
      expect(result).toEqual([])
    })

    it('should throw an error when findAllGristOutilsNonMutualises throws', async () => {
      // Arrange
      vi.mocked(findAllGristOutilsNonMutualises).mockRejectedValueOnce(new Error('API Error'))

      // Act & Assert
      await expect(getAllOutilsNonMutualises()).rejects.toThrow('API Error')
    })
  })

  describe('editOutilsStartupsMapping', () => {
    it('should call editGristOutilsStartupsMapping and return void', async () => {
      // Arrange
      const mapping: OutilsStartupsMapping = {
        id: 1,
        startupId: 10,
        outilId: 20,
        usage: 'Développement'
      }
      
      vi.mocked(editGristOutilsStartupsMapping).mockResolvedValueOnce(undefined)

      // Act
      const result = await editOutilsStartupsMapping(mapping)

      // Assert
      expect(editGristOutilsStartupsMapping).toHaveBeenCalledWith(mapping)
      expect(result).toBeUndefined()
    })

    it('should handle mapping without id (new mapping)', async () => {
      // Arrange
      const mapping: OutilsStartupsMapping = {
        startupId: 15,
        outilId: 25,
        usage: 'Production'
      }
      
      vi.mocked(editGristOutilsStartupsMapping).mockResolvedValueOnce(undefined)

      // Act
      const result = await editOutilsStartupsMapping(mapping)

      // Assert
      expect(editGristOutilsStartupsMapping).toHaveBeenCalledWith(mapping)
      expect(result).toBeUndefined()
    })

    it('should throw an error when editGristOutilsStartupsMapping throws', async () => {
      // Arrange
      const mapping: OutilsStartupsMapping = {
        id: 1,
        startupId: 10,
        outilId: 20,
        usage: 'Développement'
      }
      
      vi.mocked(editGristOutilsStartupsMapping).mockRejectedValueOnce(new Error('API Error'))

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
      
      vi.mocked(editGristOutilsStartupsMapping).mockResolvedValueOnce(undefined)

      // Act
      const result = await editOutilsStartupsMapping(mapping)

      // Assert
      expect(editGristOutilsStartupsMapping).toHaveBeenCalledWith(mapping)
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
      
      vi.mocked(editGristOutilsStartupsMapping).mockResolvedValueOnce(undefined)

      // Act
      const result = await editOutilsStartupsMapping(mapping)

      // Assert
      expect(editGristOutilsStartupsMapping).toHaveBeenCalledWith(mapping)
      expect(result).toBeUndefined()
    })
  })

  describe('deleteOutilsStartupsMapping', () => {
    it('should call deleteGristOutilsStartupsMapping and return void', async () => {
      // Arrange
      const mappingId = 1
      
      vi.mocked(deleteGristOutilsStartupsMapping).mockResolvedValueOnce(undefined)

      // Act
      const result = await deleteOutilsStartupsMapping(mappingId)

      // Assert
      expect(deleteGristOutilsStartupsMapping).toHaveBeenCalledWith(mappingId)
      expect(result).toBeUndefined()
    })

    it('should handle zero mapping ID', async () => {
      // Arrange
      const mappingId = 0
      
      vi.mocked(deleteGristOutilsStartupsMapping).mockResolvedValueOnce(undefined)

      // Act
      const result = await deleteOutilsStartupsMapping(mappingId)

      // Assert
      expect(deleteGristOutilsStartupsMapping).toHaveBeenCalledWith(mappingId)
      expect(result).toBeUndefined()
    })

    it('should throw an error when deleteGristOutilsStartupsMapping throws', async () => {
      // Arrange
      const mappingId = 1
      
      vi.mocked(deleteGristOutilsStartupsMapping).mockRejectedValueOnce(new Error('API Error'))

      // Act & Assert
      await expect(deleteOutilsStartupsMapping(mappingId)).rejects.toThrow('API Error')
    })

    it('should handle negative mapping ID', async () => {
      // Arrange
      const mappingId = -1
      
      vi.mocked(deleteGristOutilsStartupsMapping).mockResolvedValueOnce(undefined)

      // Act
      const result = await deleteOutilsStartupsMapping(mappingId)

      // Assert
      expect(deleteGristOutilsStartupsMapping).toHaveBeenCalledWith(mappingId)
      expect(result).toBeUndefined()
    })

    it('should handle large mapping ID', async () => {
      // Arrange
      const mappingId = 999999
      
      vi.mocked(deleteGristOutilsStartupsMapping).mockResolvedValueOnce(undefined)

      // Act
      const result = await deleteOutilsStartupsMapping(mappingId)

      // Assert
      expect(deleteGristOutilsStartupsMapping).toHaveBeenCalledWith(mappingId)
      expect(result).toBeUndefined()
    })
  })
})
