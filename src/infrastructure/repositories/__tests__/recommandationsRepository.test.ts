import { describe, expect, it, vi, beforeEach } from 'vitest'
import { 
  getRecommandationsByProduitId,
  getRecommandationsByProduitIdAndStatut,
  getRecommandationsNonFaitesByProduitId,
  updateRecommandationStatut
} from '../recommandationsRepository'
import * as gristRepository from '../../grist/repositories/recommandationsGristRepository'

// Mock the grist repository
vi.mock('../../grist/repositories/recommandationsGristRepository', () => ({
  findRecommandationsByProduitId: vi.fn(),
  findRecommandationsByProduitIdAndStatut: vi.fn(),
  findRecommandationsNonFaitesByProduitId: vi.fn(),
  updateRecommandationStatut: vi.fn()
}))

const mockGristRepository = vi.mocked(gristRepository)

describe('recommandationsRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getRecommandationsByProduitId', () => {
    it('should call grist repository with correct parameters', async () => {
      const mockRecommandations = [
        {
          id: 1,
          produitId: 123,
          recommandation: 'Test - Description',
          statut: 'En attente',
          comiteInvestissement: '2024-01-01'
        }
      ]

      mockGristRepository.findRecommandationsByProduitId.mockResolvedValue(mockRecommandations)

      const result = await getRecommandationsByProduitId(123)

      expect(mockGristRepository.findRecommandationsByProduitId).toHaveBeenCalledWith(123)
      expect(result).toEqual(mockRecommandations)
    })
  })

  describe('getRecommandationsByProduitIdAndStatut', () => {
    it('should call grist repository with correct parameters', async () => {
      const mockRecommandations = [
        {
          id: 1,
          produitId: 123,
          recommandation: 'Test - Description',
          statut: 'En cours',
          comiteInvestissement: '2024-01-01'
        }
      ]

      mockGristRepository.findRecommandationsByProduitIdAndStatut.mockResolvedValue(mockRecommandations)

      const result = await getRecommandationsByProduitIdAndStatut(123, 'En cours')

      expect(mockGristRepository.findRecommandationsByProduitIdAndStatut).toHaveBeenCalledWith(123, 'En cours')
      expect(result).toEqual(mockRecommandations)
    })
  })

  describe('getRecommandationsNonFaitesByProduitId', () => {
    it('should call grist repository with correct parameters', async () => {
      const mockRecommandations = [
        {
          id: 1,
          produitId: 123,
          recommandation: 'Test - Description',
          statut: 'En attente',
          comiteInvestissement: '2024-01-01'
        }
      ]

      mockGristRepository.findRecommandationsNonFaitesByProduitId.mockResolvedValue(mockRecommandations)

      const result = await getRecommandationsNonFaitesByProduitId(123)

      expect(mockGristRepository.findRecommandationsNonFaitesByProduitId).toHaveBeenCalledWith(123)
      expect(result).toEqual(mockRecommandations)
    })
  })

  describe('updateRecommandationStatut', () => {
    it('should call grist repository with correct parameters', async () => {
      mockGristRepository.updateRecommandationStatut.mockResolvedValue()

      await updateRecommandationStatut(1, 'Fait')

      expect(mockGristRepository.updateRecommandationStatut).toHaveBeenCalledWith(1, 'Fait')
    })
  })
})