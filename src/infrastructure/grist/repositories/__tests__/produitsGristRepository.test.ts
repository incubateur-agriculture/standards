import { describe, it, expect, vi, beforeEach } from 'vitest'
import { findProduitById, findAllProduits } from '../produitsGristRepository'
import { apiClient } from '@/infrastructure/grist/client/gristApiClient'
import { GRIST } from '@/infrastructure/grist/constants/gristConstants'
import { mapGristProduitToProduit } from '@/infrastructure/grist/mappers/produitMapper'

vi.mock('@/infrastructure/grist/client/gristApiClient', () => ({
    apiClient: {
        get: vi.fn()
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
}) 