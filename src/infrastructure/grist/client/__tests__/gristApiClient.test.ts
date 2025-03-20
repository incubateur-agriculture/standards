import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiClient } from '../gristApiClient'

vi.mock('axios', () => ({
    default: {
        create: vi.fn(() => ({
            get: vi.fn(),
            put: vi.fn()
        }))
    }
}))

describe('gristApiClient', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('apiClient', () => {
        describe('get', () => {
            it('should make GET request with correct parameters', async () => {
                // Arrange
                const mockResponse = { data: { records: [] } }
                vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

                // Act
                const result = await apiClient.get('/tables/test/records', {
                    params: {
                        filter: '{"field": "value"}',
                        sort: 'field'
                    }
                })

                // Assert
                expect(result).toEqual(mockResponse)
                expect(apiClient.get).toHaveBeenCalledWith('/tables/test/records', {
                    params: {
                        filter: '{"field": "value"}',
                        sort: 'field'
                    }
                })
            })

            it('should handle error in GET request', async () => {
                // Arrange
                const error = new Error('Network error')
                vi.mocked(apiClient.get).mockRejectedValue(error)

                // Act & Assert
                await expect(apiClient.get('/tables/test/records')).rejects.toThrow('Network error')
            })
        })

        describe('put', () => {
            it('should make PUT request with correct parameters', async () => {
                // Arrange
                const mockResponse = { data: { records: [] } }
                vi.mocked(apiClient.put).mockResolvedValue(mockResponse)
                const records = [{ id: 1, fields: { name: 'test' } }]

                // Act
                const result = await apiClient.put('/tables/test/records', { records })

                // Assert
                expect(result).toEqual(mockResponse)
                expect(apiClient.put).toHaveBeenCalledWith('/tables/test/records', { records })
            })

            it('should handle error in PUT request', async () => {
                // Arrange
                const error = new Error('Network error')
                vi.mocked(apiClient.put).mockRejectedValue(error)

                // Act & Assert
                await expect(apiClient.put('/tables/test/records', { records: [] }))
                    .rejects.toThrow('Network error')
            })
        })
    })
}) 