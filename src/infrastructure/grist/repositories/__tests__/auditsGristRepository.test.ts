import { describe, it, expect, vi, beforeEach } from 'vitest'
import { findAuditByHash, findPreviousAuditByHash } from '../auditsGristRepository'
import { apiClient } from '@/infrastructure/grist/client/gristApiClient'
import { GRIST } from '@/infrastructure/grist/constants/gristConstants'
import { mapGristAuditToAudit } from '@/infrastructure/grist/mappers/auditMapper'

vi.mock('@/infrastructure/grist/client/gristApiClient', () => ({
    apiClient: {
        get: vi.fn()
    }
}))

vi.mock('@/infrastructure/grist/mappers/auditMapper', () => ({
    mapGristAuditToAudit: vi.fn()
}))

describe('auditsGristRepository', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('findAuditByHash', () => {
        it('should return null when no audit is found', async () => {
            // Arrange
            vi.mocked(apiClient.get).mockResolvedValue({ data: { records: [] } })

            // Act
            const result = await findAuditByHash('non-existent-hash')

            // Assert
            expect(result).toBeNull()
            expect(apiClient.get).toHaveBeenCalledWith(
                `/tables/${GRIST.AUDITS.ID}/records`,
                {
                    params: {
                        filter: `{"${GRIST.AUDITS.FIELDS.HASH}":["non-existent-hash"]}`
                    }
                }
            )
        })

        it('should return mapped audit when found', async () => {
            // Arrange
            const mockGristAudit = {
                id: 123,
                fields: {
                    [GRIST.AUDITS.FIELDS.HASH]: 'test-hash',
                    [GRIST.AUDITS.FIELDS.COMITE_INVESTISSEMENT]: 1704067200,
                    [GRIST.AUDITS.FIELDS.CLOTURE]: false,
                    [GRIST.AUDITS.FIELDS.CLOTURE_LE]: 1704153600,
                    [GRIST.AUDITS.FIELDS.PRODUIT]: 456
                }
            }

            const mockGristProduit = {
                id: 456,
                fields: {
                    [GRIST.PRODUITS.FIELDS.NOM]: 'Test Product'
                }
            }

            const mockMappedAudit = {
                id: 123,
                dateComiteInvestissement: new Date('2024-01-01T00:00:00.000Z'),
                cloture: false,
                clotureLe: new Date('2024-01-02T00:00:00.000Z'),
                produit: {
                    id: 456,
                    nom: 'Test Product'
                }
            }

            vi.mocked(apiClient.get)
                .mockResolvedValueOnce({ data: { records: [mockGristAudit] } })
                .mockResolvedValueOnce({ data: { records: [mockGristProduit] } })
            vi.mocked(mapGristAuditToAudit).mockReturnValue(mockMappedAudit)

            // Act
            const result = await findAuditByHash('test-hash')

            // Assert
            expect(result).toEqual(mockMappedAudit)
            expect(mapGristAuditToAudit).toHaveBeenCalledWith(mockGristAudit, mockGristProduit)
        })
    })

    describe('findPreviousAuditByHash', () => {
        it('should return null when no previous audit exists', async () => {
            // Arrange
            vi.mocked(apiClient.get).mockResolvedValue({ data: { records: [] } })

            // Act
            const result = await findPreviousAuditByHash(456, 'test-hash')

            // Assert
            expect(result).toBeNull()
        })

        it('should return null when current audit is the first one', async () => {
            // Arrange
            const mockGristAudit = {
                id: 123,
                fields: {
                    [GRIST.AUDITS.FIELDS.HASH]: 'test-hash',
                    [GRIST.AUDITS.FIELDS.COMITE_INVESTISSEMENT]: 1704067200
                }
            }

            vi.mocked(apiClient.get).mockResolvedValue({
                data: { records: [mockGristAudit] }
            })

            // Act
            const result = await findPreviousAuditByHash(456, 'test-hash')

            // Assert
            expect(result).toBeNull()
        })

        it('should return previous audit when it exists', async () => {
            // Arrange
            const mockGristAudits = [
                {
                    id: 122,
                    fields: {
                        [GRIST.AUDITS.FIELDS.HASH]: 'previous-hash-S1-2024',
                        [GRIST.AUDITS.FIELDS.COMITE_INVESTISSEMENT]: 1672531200,
                        [GRIST.AUDITS.FIELDS.CLOTURE]: true,
                        [GRIST.AUDITS.FIELDS.CLOTURE_LE]: 1721001600,
                        [GRIST.AUDITS.FIELDS.PRODUIT]: 456
                    }
                },
                {
                    id: 124,
                    fields: {
                        [GRIST.AUDITS.FIELDS.HASH]: 'previous-hash-S2-2024',
                        [GRIST.AUDITS.FIELDS.CLOTURE]: true,
                        [GRIST.AUDITS.FIELDS.CLOTURE_LE]: 1735603200,
                        [GRIST.AUDITS.FIELDS.PRODUIT]: 456
                    }
                },
                {
                    id: 125,
                    fields: {
                        [GRIST.AUDITS.FIELDS.HASH]: 'previous-hash-S1-2025',
                        [GRIST.AUDITS.FIELDS.COMITE_INVESTISSEMENT]: 1749600000,
                        [GRIST.AUDITS.FIELDS.CLOTURE]: true,
                        [GRIST.AUDITS.FIELDS.CLOTURE_LE]: 1756598400,
                        [GRIST.AUDITS.FIELDS.PRODUIT]: 456
                    }
                },
                {
                    id: 123,
                    fields: {
                        [GRIST.AUDITS.FIELDS.HASH]: 'test-hash',
                        [GRIST.AUDITS.FIELDS.CLOTURE]: false,
                        [GRIST.AUDITS.FIELDS.PRODUIT]: 456
                    }
                }
            ]

            const mockGristProduit = {
                id: 456,
                fields: {
                    [GRIST.PRODUITS.FIELDS.NOM]: 'Test Product'
                }
            }

            const mockMappedAudit = {
                id: 125,
                dateComiteInvestissement: new Date('2025-06-11T00:00:00.000Z'),
                cloture: true,
                clotureLe: new Date('2023-01-02T00:00:00.000Z'),
                produit: {
                    id: 456,
                    nom: 'Test Product'
                }
            }

            vi.mocked(apiClient.get)
                .mockResolvedValueOnce({ data: { records: mockGristAudits } })
                .mockResolvedValueOnce({ data: { records: [mockGristProduit] } })
            vi.mocked(mapGristAuditToAudit).mockReturnValue(mockMappedAudit)

            // Act
            const result = await findPreviousAuditByHash(456, 'test-hash')

            // Assert
            expect(result).toEqual(mockMappedAudit)
            expect(mapGristAuditToAudit).toHaveBeenCalledWith(mockGristAudits[2], mockGristProduit)

            expect(apiClient.get).toHaveBeenCalledWith(
                `/tables/${GRIST.AUDITS.ID}/records`,
                {
                    params: {
                        filter: `{"${GRIST.AUDITS.FIELDS.PRODUIT}":[456]}`,
                        sort: GRIST.AUDITS.FIELDS.CLOTURE_LE
                    }
                }
            )
        })
    })
}) 