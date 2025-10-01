import { describe, it, expect, vi, beforeEach } from 'vitest'
import { findConsommationsByProduitId, findConsommationsDuDernierMois } from '../consommationsGristRepository'
import { apiClient } from '@/infrastructure/grist/client/gristApiClient'
import { GRIST } from '@/infrastructure/grist/constants/gristConstants'

// Mock the apiClient
vi.mock('@/infrastructure/grist/client/gristApiClient', () => ({
  apiClient: {
    get: vi.fn()
  }
}))

describe('consommationsGristRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('findConsommationsByProduitId', () => {
    it('should return consommations for a given produit ID', async () => {
      const mockResponse = {
        data: {
          records: [
            {
              id: 1,
              fields: {
                [GRIST.CONSOMMATIONS.FIELDS.PRODUIT_ID]: 123,
                [GRIST.CONSOMMATIONS.FIELDS.OUTIL]: 'AWS EC2',
                [GRIST.CONSOMMATIONS.FIELDS.COUT]: 150.50,
                [GRIST.CONSOMMATIONS.FIELDS.DETAIL]: 'Instance t3.medium',
                [GRIST.CONSOMMATIONS.FIELDS.DATE]: '2024-01-15T10:30:00Z'
              }
            }
          ]
        }
      }

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const result = await findConsommationsByProduitId(123)

      expect(apiClient.get).toHaveBeenCalledWith(`/tables/${GRIST.CONSOMMATIONS.ID}/records`, {
        params: {
          filter: `{"${GRIST.CONSOMMATIONS.FIELDS.PRODUIT_ID}":[123]}`
        }
      })

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(1)
      expect(result[0].produitId).toBe(123)
      expect(result[0].outil).toBe('AWS EC2')
    })

    it('should return empty array when no records found', async () => {
      const mockResponse = {
        data: {
          records: []
        }
      }

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const result = await findConsommationsByProduitId(123)

      expect(result).toEqual([])
    })
  })

  describe('findConsommationsDuDernierMois', () => {
    it('should call findConsommationsByProduitIdAndDateRange with correct date range', async () => {
      const mockResponse = {
        data: {
          records: []
        }
      }

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      await findConsommationsDuDernierMois(123)

      // Verify the call was made with correct structure
      expect(apiClient.get).toHaveBeenCalledWith(`/tables/${GRIST.CONSOMMATIONS.ID}/records`, {
        params: {
          filter: expect.stringMatching(new RegExp(`\\{"${GRIST.CONSOMMATIONS.FIELDS.PRODUIT_ID}":\\[123\\],"${GRIST.CONSOMMATIONS.FIELDS.DATE}":\\[\\d+\\]\\}`)),
          sort: `-${GRIST.CONSOMMATIONS.FIELDS.COUT}`
        }
      })
    })
  })
})
