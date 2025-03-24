import { describe, it, expect, vi, beforeEach } from 'vitest'
import { saveCollaborateurs, getCollaborateurs } from '../collaborateursGristRepository'
import { apiClient } from '@/infrastructure/grist/client/gristApiClient'
import { GRIST } from '@/infrastructure/grist/constants/gristConstants'
import { Collaborateur } from '@/domain/types'

// Mock the apiClient
vi.mock('@/infrastructure/grist/client/gristApiClient', () => ({
  apiClient: {
    put: vi.fn(),
    get: vi.fn()
  }
}))

describe('collaborateursGristRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('saveCollaborateurs', () => {
    const mockCollaborateurs: Collaborateur[] = [
      {
        id: 1,
        idBeta: 'beta1',
        nomComplet: 'John Doe',
        domaine: 'Tech'
      },
      {
        id: 2,
        idBeta: 'beta2',
        nomComplet: 'Jane Smith',
        domaine: 'Design'
      }
    ]

    const mockGetResponse = {
      data: {
        records: mockCollaborateurs.map(collab => ({
          id: collab.id,
          fields: {
            [GRIST.COLLABORATEURS.FIELDS.ID_BETA]: collab.idBeta,
            [GRIST.COLLABORATEURS.FIELDS.NOM_COMPLET]: collab.nomComplet,
            [GRIST.COLLABORATEURS.FIELDS.DOMAINE]: collab.domaine
          }
        }))
      }
    }

    it('should save collaborateurs and return updated data', async () => {
      vi.mocked(apiClient.put).mockResolvedValueOnce({})
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockGetResponse)

      const result = await saveCollaborateurs(mockCollaborateurs)

      // Verify PUT request
      expect(apiClient.put).toHaveBeenCalledWith(
        `/tables/${GRIST.COLLABORATEURS.ID}/records`,
        {
          records: mockCollaborateurs.map(collaborateur => ({
            require: {
              [GRIST.COLLABORATEURS.FIELDS.ID_BETA]: collaborateur.idBeta,
            },
            fields: {
              [GRIST.COLLABORATEURS.FIELDS.NOM_COMPLET]: collaborateur.nomComplet,
              [GRIST.COLLABORATEURS.FIELDS.DOMAINE]: collaborateur.domaine,
            }
          }))
        }
      )

      // Verify GET request after save
      expect(apiClient.get).toHaveBeenCalledWith(
        `/tables/${GRIST.COLLABORATEURS.ID}/records`,
        {
          params: {
            filter: JSON.stringify({
              [GRIST.COLLABORATEURS.FIELDS.ID_BETA]: mockCollaborateurs.map(c => c.idBeta)
            })
          }
        }
      )

      // Verify returned data
      expect(result).toEqual(mockCollaborateurs)
    })

    it('should handle API errors during save', async () => {
      vi.mocked(apiClient.put).mockRejectedValueOnce(new Error('API Error'))

      await expect(saveCollaborateurs(mockCollaborateurs)).rejects.toThrow('API Error')
    })
  })

  describe('getCollaborateurs', () => {
    const mockResponse = {
      data: {
        records: [
          {
            id: 1,
            fields: {
              [GRIST.COLLABORATEURS.FIELDS.ID_BETA]: 'beta1',
              [GRIST.COLLABORATEURS.FIELDS.NOM_COMPLET]: 'John Doe',
              [GRIST.COLLABORATEURS.FIELDS.DOMAINE]: 'Tech'
            }
          }
        ]
      }
    }

    it('should fetch and transform collaborateurs data', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse)

      const filters = { [GRIST.COLLABORATEURS.FIELDS.ID_BETA]: ['beta1'] }
      const result = await getCollaborateurs(filters)

      expect(apiClient.get).toHaveBeenCalledWith(
        `/tables/${GRIST.COLLABORATEURS.ID}/records`,
        {
          params: {
            filter: JSON.stringify(filters)
          }
        }
      )

      expect(result).toEqual([
        {
          id: 1,
          idBeta: 'beta1',
          nomComplet: 'John Doe',
          domaine: 'Tech'
        }
      ])
    })

    it('should return empty array when no records found', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: { records: [] } })

      const filters = { [GRIST.COLLABORATEURS.FIELDS.ID_BETA]: ['nonexistent'] }
      const result = await getCollaborateurs(filters)

      expect(result).toEqual([])
    })

    it('should handle API errors during fetch', async () => {
      vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('API Error'))

      const filters = { [GRIST.COLLABORATEURS.FIELDS.ID_BETA]: ['beta1'] }
      await expect(getCollaborateurs(filters)).rejects.toThrow('API Error')
    })
  })
}) 