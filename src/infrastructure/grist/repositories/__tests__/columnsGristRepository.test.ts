import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchColumnOptions, fetchOutilsMutualisesOptions, fetchOutilsNonMutualisesOptions } from '../columnsGristRepository'
import { apiClient } from '@/infrastructure/grist/client/gristApiClient'
import { GRIST } from '@/infrastructure/grist/constants/gristConstants'

// Mock the apiClient
vi.mock('@/infrastructure/grist/client/gristApiClient', () => ({
  apiClient: {
    get: vi.fn()
  }
}))

describe('columnsGristRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchColumnOptions', () => {
    it('should return column options when API call is successful', async () => {
      const mockResponse = {
        data: {
          columns: [{
            id: 'test_column',
            fields: {
              widgetOptions: JSON.stringify({
                choices: ['option1', 'option2']
              })
            }
          }]
        }
      }
      
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse)

      const result = await fetchColumnOptions('test_table', 'test_column')

      expect(apiClient.get).toHaveBeenCalledWith('/tables/test_table/columns')
      expect(result).toEqual([
        { id: 'option1', label: 'option1' },
        { id: 'option2', label: 'option2' }
      ])
    })

    it('should return empty array when column is not found', async () => {
      const mockResponse = {
        data: {
          columns: [{
            id: 'other_column',
            fields: {
              widgetOptions: JSON.stringify({
                choices: ['option1', 'option2']
              })
            }
          }]
        }
      }
      
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse)

      const result = await fetchColumnOptions('test_table', 'non_existent_column')

      expect(result).toEqual([])
    })

    it('should return empty array when widgetOptions parsing fails', async () => {
      const mockResponse = {
        data: {
          columns: [{
            id: 'test_column',
            fields: {
              widgetOptions: 'invalid json'
            }
          }]
        }
      }
      
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse)

      const result = await fetchColumnOptions('test_table', 'test_column')

      expect(result).toEqual([])
    })

    it('should return empty array when API call fails', async () => {
      vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('API Error'))

      const result = await fetchColumnOptions('test_table', 'test_column')

      expect(result).toEqual([])
    })
  })

  describe('fetchOutilsMutualisesOptions', () => {
    it('should call fetchColumnOptions with correct parameters', async () => {
      await fetchOutilsMutualisesOptions()

      expect(apiClient.get).toHaveBeenCalledWith(`/tables/${GRIST.PRODUITS.ID}/columns`)
    })
  })

  describe('fetchOutilsNonMutualisesOptions', () => {
    it('should call fetchColumnOptions with correct parameters', async () => {
      await fetchOutilsNonMutualisesOptions()

      expect(apiClient.get).toHaveBeenCalledWith(`/tables/${GRIST.PRODUITS.ID}/columns`)
    })
  })
}) 