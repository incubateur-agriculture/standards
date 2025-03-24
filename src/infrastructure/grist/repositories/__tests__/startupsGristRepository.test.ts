import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setStartupMembers, getGristStartups } from '../startupsGristRepository'
import { apiClient } from '@/infrastructure/grist/client/gristApiClient'
import { GRIST } from '@/infrastructure/grist/constants/gristConstants'
import { Collaborateur, Startup } from '@/domain/types'

// Mock the apiClient
vi.mock('@/infrastructure/grist/client/gristApiClient', () => ({
  apiClient: {
    put: vi.fn(),
    get: vi.fn()
  }
}))

describe('startupsGristRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('setStartupMembers', () => {
    it('should call apiClient.put with the correct parameters', async () => {
      // Arrange
      const startup: Startup = {
        id: 1,
        idBeta: 'startup-1',
        nom: 'Startup Test'
      }

      const members: Collaborateur[] = [
        {
          id: 101,
          idBeta: 'user-101',
          nomComplet: 'John Doe',
          domaine: 'Tech'
        },
        {
          id: 102,
          idBeta: 'user-102',
          nomComplet: 'Jane Smith',
          domaine: 'Design'
        }
      ]

      vi.mocked(apiClient.put).mockResolvedValueOnce({})

      // Act
      await setStartupMembers(startup, members)

      // Assert
      expect(apiClient.put).toHaveBeenCalledWith(
        `/tables/${GRIST.STARTUPS.ID}/records`,
        {
          records: [{
            require: {
              [GRIST.STARTUPS.FIELDS.ID_BETA]: 'startup-1',
            },
            fields: {
              [GRIST.STARTUPS.FIELDS.MEMBRES]: ['L', 101, 102],
            }
          }]
        }
      )
    })

    it('should throw an error when the API call fails', async () => {
      // Arrange
      const startup: Startup = {
        id: 1,
        idBeta: 'startup-1',
        nom: 'Startup Test'
      }

      const members: Collaborateur[] = [
        {
          id: 101,
          idBeta: 'user-101',
          nomComplet: 'John Doe',
          domaine: 'Tech'
        }
      ]

      vi.mocked(apiClient.put).mockRejectedValueOnce(new Error('API Error'))

      // Act & Assert
      await expect(setStartupMembers(startup, members)).rejects.toThrow('API Error')
    })
  })

  describe('getGristStartups', () => {
    it('should return mapped startups from Grist API response', async () => {
      // Arrange
      const mockResponse = {
        data: {
          records: [
            {
              id: 1,
              fields: {
                [GRIST.STARTUPS.FIELDS.ID_BETA]: 'startup-1',
                [GRIST.PRODUITS.FIELDS.NOM]: 'Startup 1',
              }
            },
            {
              id: 2,
              fields: {
                [GRIST.STARTUPS.FIELDS.ID_BETA]: 'startup-2',
                [GRIST.PRODUITS.FIELDS.NOM]: 'Startup 2',
              }
            }
          ]
        }
      }

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse)

      // Act
      const result = await getGristStartups()

      // Assert
      expect(apiClient.get).toHaveBeenCalledWith(`/tables/${GRIST.STARTUPS.ID}/records`)
      expect(result).toEqual([
        {
          id: 1,
          idBeta: 'startup-1',
          nom: 'Startup 1'
        },
        {
          id: 2,
          idBeta: 'startup-2',
          nom: 'Startup 2'
        }
      ])
    })

    it('should return an empty array when no records are found', async () => {
      // Arrange
      const mockResponse = {
        data: {
          records: []
        }
      }

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse)

      // Act
      const result = await getGristStartups()

      // Assert
      expect(result).toEqual([])
    })

    it('should throw an error when the API call fails', async () => {
      // Arrange
      vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('API Error'))

      // Act & Assert
      await expect(getGristStartups()).rejects.toThrow('API Error')
    })
  })
}) 