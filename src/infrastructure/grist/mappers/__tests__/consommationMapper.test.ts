import { describe, it, expect, vi } from 'vitest'
import { mapGristConsommationToConsommation } from '../consommationMapper'
import { GRIST } from '@/infrastructure/grist/constants/gristConstants'

// Mock the repository function
vi.mock('@/infrastructure/grist/repositories/mappingProduitHebergementGristRepository', () => ({
  getIdentifiantOutilById: vi.fn()
}))

describe('consommationMapper', () => {
  it('should map GristConsommation to Consommation correctly', async () => {
    const { getIdentifiantOutilById } = await import('@/infrastructure/grist/repositories/mappingProduitHebergementGristRepository')
    vi.mocked(getIdentifiantOutilById).mockResolvedValue('i-1234567890abcdef0')

    const gristConsommation = {
      id: 1,
      fields: {
        [GRIST.CONSOMMATIONS.FIELDS.PRODUIT_ID]: 123,
        [GRIST.CONSOMMATIONS.FIELDS.OUTIL]: 'AWS EC2',
        [GRIST.CONSOMMATIONS.FIELDS.IDENTIFIANT]: 456,
        [GRIST.CONSOMMATIONS.FIELDS.COUT]: 150.50,
        [GRIST.CONSOMMATIONS.FIELDS.DETAIL]: 'Instance t3.medium - 1 mois',
        [GRIST.CONSOMMATIONS.FIELDS.DATE]: '2024-01-15T10:30:00Z'
      }
    }

    const result = await mapGristConsommationToConsommation(gristConsommation)

    expect(result).toEqual({
      id: 1,
      produitId: 123,
      outil: 'AWS EC2',
      identifiant: 'i-1234567890abcdef0',
      cout: 150.50,
      detail: 'Instance t3.medium - 1 mois',
      date: new Date('2024-01-15T10:30:00Z')
    })
  })
})
