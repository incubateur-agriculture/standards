import { describe, it, expect, vi, beforeEach } from 'vitest'
import { findStartupById, findAllStartups, findStartupsByIncubateur, findActiveStartups, saveStartup } from '../startupsGristRepository'
import { apiClient } from '@/infrastructure/grist/client/gristApiClient'
import { GRIST } from '@/infrastructure/grist/constants/gristConstants'
import { mapGristStartupToStartup } from '@/infrastructure/grist/mappers/startupMapper'
import { Startup } from '@/domain/types'

vi.mock('@/infrastructure/grist/client/gristApiClient', () => ({
    apiClient: {
        get: vi.fn(),
        patch: vi.fn()
    }
}))

vi.mock('@/infrastructure/grist/mappers/startupMapper', () => ({
    mapGristStartupToStartup: vi.fn()
}))

describe('startupsGristRepository', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('findStartupById', () => {
        it('should return null when no startup is found', async () => {
            // Arrange
            vi.mocked(apiClient.get).mockResolvedValue({ data: { records: [] } })

            // Act
            const result = await findStartupById(1)

            // Assert
            expect(result).toBeNull()
            expect(apiClient.get).toHaveBeenCalledWith(
                `/tables/${GRIST.STARTUPS.ID}/records`,
                {
                    params: {
                        filter: `{"id":[1]}`
                    }
                }
            )
        })

        it('should return mapped startup when found', async () => {
            // Arrange
            const mockGristStartup = {
                id: 1,
                fields: {
                    [GRIST.STARTUPS.FIELDS.NOM]: 'Test Startup'
                }
            }
            const mockMappedStartup = { id: 1, nom: 'Test Startup', acronyme: 'TS', intra: 'Test', actif: true, incubateur: 'Test Incubateur' }
            vi.mocked(apiClient.get).mockResolvedValue({ data: { records: [mockGristStartup] } })
            vi.mocked(mapGristStartupToStartup).mockReturnValue(mockMappedStartup)

            // Act
            const result = await findStartupById(1)

            // Assert
            expect(result).toEqual(mockMappedStartup)
            expect(mapGristStartupToStartup).toHaveBeenCalledWith(mockGristStartup)
        })
    })

    describe('findAllStartups', () => {
        it('should return empty array when no startups found', async () => {
            // Arrange
            vi.mocked(apiClient.get).mockResolvedValue({ data: { records: [] } })

            // Act
            const result = await findAllStartups()

            // Assert
            expect(result).toEqual([])
            expect(apiClient.get).toHaveBeenCalledWith(`/tables/${GRIST.STARTUPS.ID}/records`)
        })

        it('should return mapped startups when found', async () => {
            // Arrange
            const mockGristStartups = [
                { id: 1, fields: { [GRIST.STARTUPS.FIELDS.NOM]: 'Startup 1' } },
                { id: 2, fields: { [GRIST.STARTUPS.FIELDS.NOM]: 'Startup 2' } }
            ]
            const mockMappedStartups = [
                { id: 1, nom: 'Startup 1', acronyme: 'S1', intra: 'Test1', actif: true, incubateur: 'Test Incubateur' },
                { id: 2, nom: 'Startup 2', acronyme: 'S2', intra: 'Test2', actif: true, incubateur: 'Test Incubateur' }
            ]
            vi.mocked(apiClient.get).mockResolvedValue({ data: { records: mockGristStartups } })
            vi.mocked(mapGristStartupToStartup)
                .mockReturnValueOnce(mockMappedStartups[0])
                .mockReturnValueOnce(mockMappedStartups[1])

            // Act
            const result = await findAllStartups()

            // Assert
            expect(result).toEqual(mockMappedStartups)
            expect(mapGristStartupToStartup).toHaveBeenCalledTimes(2)
            expect(mapGristStartupToStartup).toHaveBeenCalledWith(mockGristStartups[0])
            expect(mapGristStartupToStartup).toHaveBeenCalledWith(mockGristStartups[1])
        })
    })

    describe('findStartupsByIncubateur', () => {
        it('should return empty array when no startups found for incubateur', async () => {
            // Arrange
            vi.mocked(apiClient.get).mockResolvedValue({ data: { records: [] } })

            // Act
            const result = await findStartupsByIncubateur('Test Incubateur')

            // Assert
            expect(result).toEqual([])
            expect(apiClient.get).toHaveBeenCalledWith(
                `/tables/${GRIST.STARTUPS.ID}/records`,
                {
                    params: {
                        filter: `{"${GRIST.STARTUPS.FIELDS.INCUBATEUR}":["Test Incubateur"]}`
                    }
                }
            )
        })

        it('should return mapped startups when found for incubateur', async () => {
            // Arrange
            const mockGristStartups = [
                { id: 1, fields: { [GRIST.STARTUPS.FIELDS.NOM]: 'Startup 1' } }
            ]
            const mockMappedStartup = { id: 1, nom: 'Startup 1', acronyme: 'S1', intra: 'Test1', actif: true, incubateur: 'Test Incubateur' }
            vi.mocked(apiClient.get).mockResolvedValue({ data: { records: mockGristStartups } })
            vi.mocked(mapGristStartupToStartup).mockReturnValue(mockMappedStartup)

            // Act
            const result = await findStartupsByIncubateur('Test Incubateur')

            // Assert
            expect(result).toEqual([mockMappedStartup])
            expect(mapGristStartupToStartup).toHaveBeenCalledWith(mockGristStartups[0])
        })
    })

    describe('findActiveStartups', () => {
        it('should return empty array when no active startups found', async () => {
            // Arrange
            vi.mocked(apiClient.get).mockResolvedValue({ data: { records: [] } })

            // Act
            const result = await findActiveStartups()

            // Assert
            expect(result).toEqual([])
            expect(apiClient.get).toHaveBeenCalledWith(
                `/tables/${GRIST.STARTUPS.ID}/records`,
                {
                    params: {
                        filter: `{"${GRIST.STARTUPS.FIELDS.ACTIF}":[true]}`
                    }
                }
            )
        })

        it('should return mapped active startups when found', async () => {
            // Arrange
            const mockGristStartups = [
                { id: 1, fields: { [GRIST.STARTUPS.FIELDS.NOM]: 'Active Startup' } }
            ]
            const mockMappedStartup = { id: 1, nom: 'Active Startup', acronyme: 'AS', intra: 'Test', actif: true, incubateur: 'Test Incubateur' }
            vi.mocked(apiClient.get).mockResolvedValue({ data: { records: mockGristStartups } })
            vi.mocked(mapGristStartupToStartup).mockReturnValue(mockMappedStartup)

            // Act
            const result = await findActiveStartups()

            // Assert
            expect(result).toEqual([mockMappedStartup])
            expect(mapGristStartupToStartup).toHaveBeenCalledWith(mockGristStartups[0])
        })
    })

    describe('saveStartup', () => {
        it('should handle non-array values in startup', async () => {
            // Arrange
            const startup: Startup = {
                id: 1,
                nom: 'Test Startup',
                acronyme: 'TS',
                intra: 'Test',
                actif: true,
                incubateur: 'Test Incubateur',
                outilsStartups: null as any
            }
            vi.mocked(apiClient.patch).mockResolvedValue({ status: 200, data: {} })

            // Act
            await saveStartup(startup)

            // Assert
            expect(apiClient.patch).toHaveBeenCalledWith(
                `/tables/${GRIST.STARTUPS.ID}/records`,
                {
                    records: [{
                        id: 1,
                        fields: {
                            [GRIST.STARTUPS.FIELDS.NOM]: 'Test Startup',
                            [GRIST.STARTUPS.FIELDS.ACRONYME]: 'TS',
                            [GRIST.STARTUPS.FIELDS.INTRA]: 'Test',
                            [GRIST.STARTUPS.FIELDS.ACTIF]: true,
                            [GRIST.STARTUPS.FIELDS.INCUBATEUR]: 'Test Incubateur',
                            [GRIST.STARTUPS.FIELDS.STATUT]: null,
                            [GRIST.STARTUPS.FIELDS.TYPOLOGIE_PRODUIT]: null,
                            [GRIST.STARTUPS.FIELDS.BASE_RH]: null,
                            [GRIST.STARTUPS.FIELDS.ID_CANAL_MATTERMOST]: null,
                            [GRIST.STARTUPS.FIELDS.OUTILS_STARTUPS]: []
                        }
                    }]
                }
            )
        })
        
        it('should throw an error when startup is invalid or ID is missing', async () => {
            // Arrange
            const startup: Startup = null as any;
            
            // Act & Assert
            await expect(saveStartup(startup)).rejects.toThrow('Startup invalide ou ID manquant');
            expect(apiClient.patch).not.toHaveBeenCalled();
        })
        
        it('should throw an error when startup ID is missing', async () => {
            // Arrange
            const startup = {
                nom: 'Test Startup',
                acronyme: 'TS',
                intra: 'Test',
                actif: true,
                incubateur: 'Test Incubateur'
            } as Startup;
            
            // Act & Assert
            await expect(saveStartup(startup)).rejects.toThrow('Startup invalide ou ID manquant');
            expect(apiClient.patch).not.toHaveBeenCalled();
        })
        
        it('should properly format array fields with L prefix', async () => {
            // Arrange
            const startup: Startup = {
                id: 1,
                nom: 'Test Startup',
                acronyme: 'TS',
                intra: 'Test',
                actif: true,
                incubateur: 'Test Incubateur',
                outilsStartups: ['Product', 'Développement']
            }
            vi.mocked(apiClient.patch).mockResolvedValue({ status: 200, data: {} })

            // Act
            await saveStartup(startup)

            // Assert
            expect(apiClient.patch).toHaveBeenCalledWith(
                `/tables/${GRIST.STARTUPS.ID}/records`,
                {
                    records: [{
                        id: 1,
                        fields: {
                            [GRIST.STARTUPS.FIELDS.NOM]: 'Test Startup',
                            [GRIST.STARTUPS.FIELDS.ACRONYME]: 'TS',
                            [GRIST.STARTUPS.FIELDS.INTRA]: 'Test',
                            [GRIST.STARTUPS.FIELDS.ACTIF]: true,
                            [GRIST.STARTUPS.FIELDS.INCUBATEUR]: 'Test Incubateur',
                            [GRIST.STARTUPS.FIELDS.STATUT]: null,
                            [GRIST.STARTUPS.FIELDS.TYPOLOGIE_PRODUIT]: null,
                            [GRIST.STARTUPS.FIELDS.BASE_RH]: null,
                            [GRIST.STARTUPS.FIELDS.ID_CANAL_MATTERMOST]: null,
                            [GRIST.STARTUPS.FIELDS.OUTILS_STARTUPS]: ['L', 'Product', 'Développement']
                        }
                    }]
                }
            )
        })
        
        it('should handle API error responses', async () => {
            // Arrange
            const startup: Startup = {
                id: 1,
                nom: 'Test Startup',
                acronyme: 'TS',
                intra: 'Test',
                actif: true,
                incubateur: 'Test Incubateur',
                outilsStartups: ['Product']
            }
            vi.mocked(apiClient.patch).mockResolvedValue({ status: 400, data: { error: 'Bad request' } })
            
            // Spy on console.error
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

            // Act & Assert
            await expect(saveStartup(startup)).rejects.toThrow('Error saving startup: 400')
            expect(consoleErrorSpy).toHaveBeenCalled()
            
            // Restore console.error
            consoleErrorSpy.mockRestore()
        })
        
        it('should handle exceptions during API call', async () => {
            // Arrange
            const startup: Startup = {
                id: 1,
                nom: 'Test Startup',
                acronyme: 'TS',
                intra: 'Test',
                actif: true,
                incubateur: 'Test Incubateur',
                outilsStartups: ['Product']
            }
            vi.mocked(apiClient.patch).mockRejectedValue(new Error('Network error'))
            
            // Spy on console.error
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

            // Act & Assert
            await expect(saveStartup(startup)).rejects.toThrow('Network error')
            expect(consoleErrorSpy).toHaveBeenCalled()
            
            // Restore console.error
            consoleErrorSpy.mockRestore()
        })
    })
})
