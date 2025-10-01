import { describe, it, expect } from 'vitest'
import { mapGristConsommationToConsommation } from '../consommationMapper'
import { GRIST } from '@/infrastructure/grist/constants/gristConstants'

describe('consommationMapper', () => {
  it('should map GristConsommation to Consommation correctly', () => {
    const gristConsommation = {
      id: 1,
      fields: {
        [GRIST.CONSOMMATIONS.FIELDS.PRODUIT_ID]: 123,
        [GRIST.CONSOMMATIONS.FIELDS.OUTIL]: 'AWS EC2',
        [GRIST.CONSOMMATIONS.FIELDS.COUT]: 150.50,
        [GRIST.CONSOMMATIONS.FIELDS.DETAIL]: 'Instance t3.medium - 1 mois',
        [GRIST.CONSOMMATIONS.FIELDS.DATE]: '2024-01-15T10:30:00Z'
      }
    }

    const result = mapGristConsommationToConsommation(gristConsommation)

    expect(result).toEqual({
      id: 1,
      produitId: 123,
      outil: 'AWS EC2',
      cout: 150.50,
      detail: 'Instance t3.medium - 1 mois',
      date: new Date('2024-01-15T10:30:00Z')
    })
  })
})
