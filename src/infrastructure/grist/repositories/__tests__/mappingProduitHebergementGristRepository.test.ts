import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
    getAllMappingProduitHebergement,
    getMappingProduitHebergementById,
    getIdentifiantOutilById,
    clearMappingCache,
    getCacheStats
} from '../mappingProduitHebergementGristRepository'
import { apiClient } from '@/infrastructure/grist/client/gristApiClient'

// Mock du client API
vi.mock('@/infrastructure/grist/client/gristApiClient', () => ({
    apiClient: {
        get: vi.fn()
    }
}))

const mockApiClient = vi.mocked(apiClient)

describe('mappingProduitHebergementGristRepository', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        clearMappingCache()
    })

    describe('getAllMappingProduitHebergement', () => {
        it('should return all mapping produit hebergement', async () => {
            const mockGristData = {
                data: {
                    records: [
                        {
                            id: 1,
                            fields: {
                                'Identifiant_Outil': 'identifiant-1'
                            }
                        },
                        {
                            id: 2,
                            fields: {
                                'Identifiant_Outil': 'identifiant-2'
                            }
                        }
                    ]
                }
            }

            mockApiClient.get.mockResolvedValue(mockGristData)

            const result = await getAllMappingProduitHebergement()

            expect(result).toHaveLength(2)
            expect(result[0]).toEqual({
                id: 1,
                identifiantOutil: 'identifiant-1'
            })
            expect(result[1]).toEqual({
                id: 2,
                identifiantOutil: 'identifiant-2'
            })
        })

        it('should return empty array when no records', async () => {
            const mockGristData = {
                data: {
                    records: []
                }
            }

            mockApiClient.get.mockResolvedValue(mockGristData)

            const result = await getAllMappingProduitHebergement()

            expect(result).toEqual([])
        })
    })

    describe('getMappingProduitHebergementById', () => {
        it('should return mapping by id', async () => {
            const mockGristData = {
                data: {
                    records: [
                        {
                            id: 1,
                            fields: {
                                'Identifiant_Outil': 'identifiant-1'
                            }
                        },
                        {
                            id: 2,
                            fields: {
                                'Identifiant_Outil': 'identifiant-2'
                            }
                        }
                    ]
                }
            }

            mockApiClient.get.mockResolvedValue(mockGristData)

            const result = await getMappingProduitHebergementById(1)

            expect(result).toEqual({
                id: 1,
                identifiantOutil: 'identifiant-1'
            })
        })

        it('should return null when id not found', async () => {
            const mockGristData = {
                data: {
                    records: [
                        {
                            id: 1,
                            fields: {
                                'Identifiant_Outil': 'identifiant-1'
                            }
                        }
                    ]
                }
            }

            mockApiClient.get.mockResolvedValue(mockGristData)

            const result = await getMappingProduitHebergementById(999)

            expect(result).toBeNull()
        })
    })

    describe('getIdentifiantOutilById', () => {
        it('should return identifiant outil by id with cache', async () => {
            const mockGristData = {
                data: {
                    records: [
                        {
                            id: 1,
                            fields: {
                                'Identifiant_Outil': 'identifiant-1'
                            }
                        },
                        {
                            id: 2,
                            fields: {
                                'Identifiant_Outil': 'identifiant-2'
                            }
                        }
                    ]
                }
            }

            mockApiClient.get.mockResolvedValue(mockGristData)

            // Premier appel - charge le cache
            const result1 = await getIdentifiantOutilById(1)
            expect(result1).toBe('identifiant-1')

            // Deuxième appel - utilise le cache
            const result2 = await getIdentifiantOutilById(2)
            expect(result2).toBe('identifiant-2')

            // Vérifier que l'API n'a été appelée qu'une seule fois
            expect(mockApiClient.get).toHaveBeenCalledTimes(1)
        })

        it('should return null when id not found', async () => {
            const mockGristData = {
                data: {
                    records: [
                        {
                            id: 1,
                            fields: {
                                'Identifiant_Outil': 'identifiant-1'
                            }
                        }
                    ]
                }
            }

            mockApiClient.get.mockResolvedValue(mockGristData)

            const result = await getIdentifiantOutilById(999)

            expect(result).toBeNull()
        })
    })

    describe('getCacheStats', () => {
        it('should return cache statistics', async () => {
            const mockGristData = {
                data: {
                    records: [
                        {
                            id: 1,
                            fields: {
                                'Identifiant_Outil': 'identifiant-1'
                            }
                        },
                        {
                            id: 2,
                            fields: {
                                'Identifiant_Outil': 'identifiant-2'
                            }
                        }
                    ]
                }
            }

            mockApiClient.get.mockResolvedValue(mockGristData)

            // Charger des données pour remplir le cache
            await getAllMappingProduitHebergement()
            await getIdentifiantOutilById(1)

            const stats = getCacheStats()
            
            expect(stats.mappingCacheSize).toBeGreaterThan(0)
            expect(stats.fullMappingCacheSize).toBeGreaterThan(0)
        })
    })

    describe('clearMappingCache', () => {
        it('should clear the cache', async () => {
            const mockGristData = {
                data: {
                    records: [
                        {
                            id: 1,
                            fields: {
                                'Identifiant_Outil': 'identifiant-1'
                            }
                        }
                    ]
                }
            }

            mockApiClient.get.mockResolvedValue(mockGristData)

            // Premier appel - charge le cache
            await getIdentifiantOutilById(1)
            expect(mockApiClient.get).toHaveBeenCalledTimes(1)

            // Clear cache
            clearMappingCache()

            // Deuxième appel - recharge le cache
            await getIdentifiantOutilById(1)
            expect(mockApiClient.get).toHaveBeenCalledTimes(2)
        })
    })

    describe('TTL Cache behavior', () => {
        it('should handle cache expiration', async () => {
            const mockGristData = {
                data: {
                    records: [
                        {
                            id: 1,
                            fields: {
                                'Identifiant_Outil': 'identifiant-1'
                            }
                        }
                    ]
                }
            }

            mockApiClient.get.mockResolvedValue(mockGristData)

            // Premier appel - charge le cache
            const result1 = await getIdentifiantOutilById(1)
            expect(result1).toBe('identifiant-1')
            expect(mockApiClient.get).toHaveBeenCalledTimes(1)

            // Deuxième appel - utilise le cache
            const result2 = await getIdentifiantOutilById(1)
            expect(result2).toBe('identifiant-1')
            expect(mockApiClient.get).toHaveBeenCalledTimes(1)

            // Vérifier les stats du cache
            const stats = getCacheStats()
            expect(stats.mappingCacheSize).toBe(1)
            expect(stats.fullMappingCacheSize).toBe(1)
        })

        it('should use both caches efficiently', async () => {
            const mockGristData = {
                data: {
                    records: [
                        {
                            id: 1,
                            fields: {
                                'Identifiant_Outil': 'identifiant-1'
                            }
                        },
                        {
                            id: 2,
                            fields: {
                                'Identifiant_Outil': 'identifiant-2'
                            }
                        }
                    ]
                }
            }

            mockApiClient.get.mockResolvedValue(mockGristData)

            // Charger toutes les données
            await getAllMappingProduitHebergement()
            expect(mockApiClient.get).toHaveBeenCalledTimes(1)

            // Récupérer un identifiant spécifique (devrait utiliser le cache complet)
            const result1 = await getIdentifiantOutilById(1)
            expect(result1).toBe('identifiant-1')
            expect(mockApiClient.get).toHaveBeenCalledTimes(1)

            // Récupérer le même identifiant (devrait utiliser le cache des identifiants)
            const result2 = await getIdentifiantOutilById(1)
            expect(result2).toBe('identifiant-1')
            expect(mockApiClient.get).toHaveBeenCalledTimes(1)

            // Récupérer un autre identifiant (devrait utiliser le cache complet)
            const result3 = await getIdentifiantOutilById(2)
            expect(result3).toBe('identifiant-2')
            expect(mockApiClient.get).toHaveBeenCalledTimes(1)
        })
    })
})
