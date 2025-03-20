import { describe, it, expect } from 'vitest'
import { mapGristAuditToAudit } from '../auditMapper'
import { GRIST } from '@/infrastructure/grist/constants/gristConstants'

describe('auditMapper', () => {
    describe('mapGristAuditToAudit', () => {
        it('should return null when gristAudit is null', () => {
            expect(mapGristAuditToAudit(null, {})).toBeNull()
        })

        it('should return null when gristProduit is null', () => {
            expect(mapGristAuditToAudit({}, null)).toBeNull()
        })

        it('should map Grist audit to domain audit', () => {
            // Arrange
            const gristAudit = {
                id: 123,
                fields: {
                    [GRIST.AUDITS.FIELDS.COMITE_INVESTISSEMENT]: 1704067200, // 2024-01-01
                    [GRIST.AUDITS.FIELDS.CLOTURE]: true,
                    [GRIST.AUDITS.FIELDS.CLOTURE_LE]: 1704153600, // 2024-01-02
                    [GRIST.AUDITS.FIELDS.PRODUIT]: 456
                }
            }

            const gristProduit = {
                id: 456,
                fields: {
                    [GRIST.PRODUITS.FIELDS.NOM]: 'Test Product'
                }
            }

            // Act
            const result = mapGristAuditToAudit(gristAudit, gristProduit)

            // Assert
            expect(result).toEqual({
                id: 123,
                dateComiteInvestissement: new Date('2024-01-01T00:00:00.000Z'),
                cloture: true,
                clotureLe: new Date('2024-01-02T00:00:00.000Z'),
                produit: {
                    id: 456,
                    nom: 'Test Product'
                }
            })
        })

        it('should handle missing fields', () => {
            // Arrange
            const gristAudit = {
                id: 123,
                fields: {
                    [GRIST.AUDITS.FIELDS.COMITE_INVESTISSEMENT]: null,
                    [GRIST.AUDITS.FIELDS.CLOTURE]: false,
                    [GRIST.AUDITS.FIELDS.CLOTURE_LE]: null,
                    [GRIST.AUDITS.FIELDS.PRODUIT]: 456
                }
            }

            const gristProduit = {
                id: 456,
                fields: {
                    [GRIST.PRODUITS.FIELDS.NOM]: 'Test Product'
                }
            }

            // Act
            const result = mapGristAuditToAudit(gristAudit, gristProduit)

            // Assert
            expect(result).toEqual({
                id: 123,
                dateComiteInvestissement: new Date(0),
                cloture: false,
                clotureLe: new Date(0),
                produit: {
                    id: 456,
                    nom: 'Test Product'
                }
            })
        })
    })
}) 