import { describe, expect, it, vi, beforeEach } from 'vitest'
import { 
  findRecommandationsByProduitId,
  findRecommandationsByProduitIdAndStatut,
  findRecommandationsNonFaitesByProduitId,
  updateRecommandationStatut
} from '../recommandationsGristRepository'
import { apiClient } from '../../client/gristApiClient'
import { GRIST } from '../../constants/gristConstants'

// Mock the apiClient
vi.mock('../../client/gristApiClient', () => ({
  apiClient: {
    get: vi.fn(),
    patch: vi.fn()
  }
}))

const mockApiClient = vi.mocked(apiClient)

describe('recommandationsGristRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('findRecommandationsByProduitId', () => {
    it('should fetch recommandations by produit id', async () => {
      const mockRecommandations = [
        {
          id: 1,
          fields: {
            [GRIST.RECOMMANDATIONS.FIELDS.PRODUIT_ID]: 123,
            [GRIST.RECOMMANDATIONS.FIELDS.RECOMMANDATION]: 'Test 1 - Description 1',
            [GRIST.RECOMMANDATIONS.FIELDS.STATUT]: 'En attente',
            [GRIST.RECOMMANDATIONS.FIELDS.COMITE_INVESTISSEMENT]: '2024-01-01'
          }
        }
      ]

      mockApiClient.get.mockResolvedValue({
        data: { records: mockRecommandations }
      })

      const result = await findRecommandationsByProduitId(123)

      expect(mockApiClient.get).toHaveBeenCalledWith(
        `/tables/${GRIST.RECOMMANDATIONS.ID}/records`,
        {
          params: {
            filter: `{"${GRIST.RECOMMANDATIONS.FIELDS.PRODUIT_ID}":[123]}`,
            sort: `-${GRIST.RECOMMANDATIONS.FIELDS.PRIORITE}`
          }
        }
      )

      expect(result).toHaveLength(1)
      expect(result[0].produitId).toBe(123)
      expect(result[0].recommandation).toBe('Test 1 - Description 1')
    })
  })

  describe('findRecommandationsByProduitIdAndStatut', () => {
    it('should fetch recommandations by produit id and statut', async () => {
      const mockRecommandations = [
        {
          id: 1,
          fields: {
            [GRIST.RECOMMANDATIONS.FIELDS.PRODUIT_ID]: 123,
            [GRIST.RECOMMANDATIONS.FIELDS.RECOMMANDATION]: 'Test 1 - Description 1',
            [GRIST.RECOMMANDATIONS.FIELDS.STATUT]: 'En cours',
            [GRIST.RECOMMANDATIONS.FIELDS.COMITE_INVESTISSEMENT]: '2024-01-01'
          }
        }
      ]

      mockApiClient.get.mockResolvedValue({
        data: { records: mockRecommandations }
      })

      const result = await findRecommandationsByProduitIdAndStatut(123, 'En cours')

      expect(mockApiClient.get).toHaveBeenCalledWith(
        `/tables/${GRIST.RECOMMANDATIONS.ID}/records`,
        {
          params: {
            filter: `{"${GRIST.RECOMMANDATIONS.FIELDS.PRODUIT_ID}":[123],"${GRIST.RECOMMANDATIONS.FIELDS.STATUT}":"En cours"}`,
            sort: `-${GRIST.RECOMMANDATIONS.FIELDS.PRIORITE}`
          }
        }
      )

      expect(result).toHaveLength(1)
      expect(result[0].statut).toBe('En cours')
    })
  })

  describe('findRecommandationsNonFaitesByProduitId', () => {
    it('should fetch recommandations that are not "Fait"', async () => {
      const mockRecommandations = [
        {
          id: 1,
          fields: {
            [GRIST.RECOMMANDATIONS.FIELDS.PRODUIT_ID]: 123,
            [GRIST.RECOMMANDATIONS.FIELDS.RECOMMANDATION]: 'Test 1 - Description 1',
            [GRIST.RECOMMANDATIONS.FIELDS.STATUT]: 'En attente',
            [GRIST.RECOMMANDATIONS.FIELDS.COMITE_INVESTISSEMENT]: '2024-01-01'
          }
        }
      ]

      mockApiClient.get.mockResolvedValue({
        data: { records: mockRecommandations }
      })

      const result = await findRecommandationsNonFaitesByProduitId(123)

      expect(mockApiClient.get).toHaveBeenCalledWith(
        `/tables/${GRIST.RECOMMANDATIONS.ID}/records`,
        {
          params: {
            filter: `{"${GRIST.RECOMMANDATIONS.FIELDS.PRODUIT_ID}":[123]}`,
            sort: `-${GRIST.RECOMMANDATIONS.FIELDS.PRIORITE}`
          }
        }
      )

      expect(result).toHaveLength(1)
    })
  })

  describe('updateRecommandationStatut', () => {
    it('should update recommandation statut', async () => {
      mockApiClient.patch.mockResolvedValue({ data: {} })

      await updateRecommandationStatut(1, 'Fait')

      expect(mockApiClient.patch).toHaveBeenCalledWith(
        `/tables/${GRIST.RECOMMANDATIONS.ID}/records`,
        {
          records: [{
            id: 1,
            fields: {
              [GRIST.RECOMMANDATIONS.FIELDS.STATUT]: 'Fait'
            }
          }]
        }
      )
    })
  })
})