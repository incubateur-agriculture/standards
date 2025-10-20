import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getConsommationsByProduitMaitreId, getConsommationsDuDernierMois } from '../consommationRepository'
import * as consommationsGristRepository from '@/infrastructure/grist/repositories/consommationsGristRepository'

// Mock the grist repository
vi.mock('@/infrastructure/grist/repositories/consommationsGristRepository', () => ({
  findConsommationsByProduitId: vi.fn(),
  findConsommationsDuDernierMois: vi.fn()
}))

describe('consommationRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getConsommationsByProduitId', () => {
    it('should return consommations from grist repository', async () => {
      const mockConsommations = [
        {
          id: 1,
          produitId: 123,
          outil: 'AWS EC2',
          cout: 150.50,
          detail: 'Instance t3.medium',
          date: new Date('2024-01-15T10:30:00Z')
        }
      ]

      vi.mocked(consommationsGristRepository.findConsommationsByProduitId).mockResolvedValue(mockConsommations)

      const result = await getConsommationsByProduitMaitreId(123)

      expect(consommationsGristRepository.findConsommationsByProduitId).toHaveBeenCalledWith(123)
      expect(result).toEqual(mockConsommations)
    })
  })

  describe('getConsommationsDuDernierMois', () => {
    it('should return consommations from last month', async () => {
      const mockConsommations = [
        {
          id: 1,
          produitId: 123,
          outil: 'AWS EC2',
          cout: 150.50,
          detail: 'Instance t3.medium',
          date: new Date('2024-01-15T10:30:00Z')
        }
      ]

      vi.mocked(consommationsGristRepository.findConsommationsDuDernierMois).mockResolvedValue(mockConsommations)

      const result = await getConsommationsDuDernierMois(123)

      expect(consommationsGristRepository.findConsommationsDuDernierMois).toHaveBeenCalledWith(123)
      expect(result).toEqual(mockConsommations)
    })
  })
})
