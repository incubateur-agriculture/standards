import { describe, it, expect, vi, beforeEach } from 'vitest'
import { findProduitById, findAllProduits, saveProduit } from '../produitsGristRepository'
import { apiClient } from '@/infrastructure/grist/client/gristApiClient'
import { GRIST } from '@/infrastructure/grist/constants/gristConstants'
import { mapGristProduitToProduit } from '@/infrastructure/grist/mappers/produitMapper'
import { Produit } from '@/domain/types'

vi.mock('@/infrastructure/grist/client/gristApiClient', () => ({
    apiClient: {
        get: vi.fn(),
        patch: vi.fn()
    }
}))

vi.mock('@/infrastructure/grist/mappers/produitMapper', () => ({
    mapGristProduitToProduit: vi.fn()
}))

describe('produitsGristRepository', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('findProduitById', () => {
        it('should return null when no product is found', async () => {
            // Arrange
            vi.mocked(apiClient.get).mockResolvedValue({ data: { records: [] } })

            // Act
            const result = await findProduitById(1)

            // Assert
            expect(result).toBeNull()
            expect(apiClient.get).toHaveBeenCalledWith(
                `/tables/${GRIST.PRODUITS.ID}/records`,
                {
                    params: {
                        filter: `{"${GRIST.PRODUITS.FIELDS.ID}":["1"]}`
                    }
                }
            )
        })

        it('should return mapped product when found', async () => {
            // Arrange
            const mockGristProduit = {
                id: 1,
                fields: {
                    [GRIST.PRODUITS.FIELDS.NOM]: 'Test Product'
                }
            }
            const mockMappedProduit = { id: 1, nom: 'Test Product' }
            vi.mocked(apiClient.get).mockResolvedValue({ data: { records: [mockGristProduit] } })
            vi.mocked(mapGristProduitToProduit).mockReturnValue(mockMappedProduit)

            // Act
            const result = await findProduitById(1)

            // Assert
            expect(result).toEqual(mockMappedProduit)
            expect(mapGristProduitToProduit).toHaveBeenCalledWith(mockGristProduit)
        })
    })

    describe('findAllProduits', () => {
        it('should return empty array when no products found', async () => {
            // Arrange
            vi.mocked(apiClient.get).mockResolvedValue({ data: { records: [] } })

            // Act
            const result = await findAllProduits()

            // Assert
            expect(result).toEqual([])
            expect(apiClient.get).toHaveBeenCalledWith(`/tables/${GRIST.PRODUITS.ID}/records`)
        })

        it('should return mapped products when found', async () => {
            // Arrange
            const mockGristProduits = [
                { id: 1, fields: { [GRIST.PRODUITS.FIELDS.NOM]: 'Product 1' } },
                { id: 2, fields: { [GRIST.PRODUITS.FIELDS.NOM]: 'Product 2' } }
            ]
            const mockMappedProduits = [
                { id: 1, nom: 'Product 1' },
                { id: 2, nom: 'Product 2' }
            ]
            vi.mocked(apiClient.get).mockResolvedValue({ data: { records: mockGristProduits } })
            vi.mocked(mapGristProduitToProduit)
                .mockReturnValueOnce(mockMappedProduits[0])
                .mockReturnValueOnce(mockMappedProduits[1])

            // Act
            const result = await findAllProduits()

            // Assert
            expect(result).toEqual(mockMappedProduits)
            expect(mapGristProduitToProduit).toHaveBeenCalledTimes(2)
            expect(mapGristProduitToProduit).toHaveBeenCalledWith(mockGristProduits[0])
            expect(mapGristProduitToProduit).toHaveBeenCalledWith(mockGristProduits[1])
        })
    })

    describe('saveProduit', () => {
        it('should handle non-array values in produit', async () => {
            // Arrange
            const produit: Produit = {
                id: 1,
                outilsMutualises: null as any,
                outilsNonMutualises: undefined as any
            } as Produit
            vi.mocked(apiClient.patch).mockResolvedValue({ status: 200, data: {} })

            // Act
            await saveProduit(produit)

            // Assert
            expect(apiClient.patch).toHaveBeenCalledWith(
                `/tables/${GRIST.PRODUITS.ID}/records`,
                {
                    records: [{
                        id: 1,
                        fields: {
                            [GRIST.PRODUITS.FIELDS.OUTILS_MUTUALISES]: [],
                            [GRIST.PRODUITS.FIELDS.OUTILS_NON_MUTUALISES]: []
                        }
                    }]
                }
            )
        })
        
        it('should throw an error when produit is invalid or ID is missing', async () => {
            // Arrange
            const produit: Produit = null as any;
            
            // Act & Assert
            await expect(saveProduit(produit)).rejects.toThrow('Produit invalide ou ID manquant');
            expect(apiClient.patch).not.toHaveBeenCalled();
        })
        
        it('should throw an error when produit ID is missing', async () => {
            // Arrange
            const produit = {
                nom: 'Test Product',
                outilsMutualises: ['Matomo'],
                outilsNonMutualises: ['Custom Tool']
            } as Produit;
            
            // Act & Assert
            await expect(saveProduit(produit)).rejects.toThrow('Produit invalide ou ID manquant');
            expect(apiClient.patch).not.toHaveBeenCalled();
        })
        
        it('should properly format array fields with L prefix', async () => {
            // Arrange
            const produit: Produit = {
                id: 1,
                outilsMutualises: ['Matomo', 'Sentry'],
                outilsNonMutualises: ['Custom Tool']
            } as Produit
            vi.mocked(apiClient.patch).mockResolvedValue({ status: 200, data: {} })

            // Act
            await saveProduit(produit)

            // Assert
            expect(apiClient.patch).toHaveBeenCalledWith(
                `/tables/${GRIST.PRODUITS.ID}/records`,
                {
                    records: [{
                        id: 1,
                        fields: {
                            [GRIST.PRODUITS.FIELDS.OUTILS_MUTUALISES]: ['L', 'Matomo', 'Sentry'],
                            [GRIST.PRODUITS.FIELDS.OUTILS_NON_MUTUALISES]: ['L', 'Custom Tool']
                        }
                    }]
                }
            )
        })
        
        it('should handle API error responses', async () => {
            // Arrange
            const produit: Produit = {
                id: 1,
                outilsMutualises: ['Matomo'],
                outilsNonMutualises: ['Custom Tool']
            } as Produit
            vi.mocked(apiClient.patch).mockResolvedValue({ status: 400, data: { error: 'Bad request' } })
            
            // Spy on console.error
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

            // Act & Assert
            await expect(saveProduit(produit)).rejects.toThrow('Error saving product: 400')
            expect(consoleErrorSpy).toHaveBeenCalled()
            
            // Restore console.error
            consoleErrorSpy.mockRestore()
        })
        
        it('should handle exceptions during API call', async () => {
            // Arrange
            const produit: Produit = {
                id: 1,
                outilsMutualises: ['Matomo'],
                outilsNonMutualises: ['Custom Tool']
            } as Produit
            vi.mocked(apiClient.patch).mockRejectedValue(new Error('Network error'))
            
            // Spy on console.error
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

            // Act & Assert
            await expect(saveProduit(produit)).rejects.toThrow('Network error')
            expect(consoleErrorSpy).toHaveBeenCalled()
            
            // Restore console.error
            consoleErrorSpy.mockRestore()
        })
    })
}) 