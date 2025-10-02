import { describe, expect, it } from 'vitest'
import { GristRecommandation, mapGristRecommandationToRecommandation } from '../recommandationMapper'
import { GRIST } from '../../constants/gristConstants'

describe('recommandationMapper', () => {
  it('should map GristRecommandation to Recommandation correctly', () => {
    const gristRecommandation: GristRecommandation = {
      id: 1,
      fields: {
        [GRIST.RECOMMANDATIONS.FIELDS.PRODUIT_ID]: 123,
        [GRIST.RECOMMANDATIONS.FIELDS.RECOMMANDATION]: 'Test Recommandation - Description de test',
        [GRIST.RECOMMANDATIONS.FIELDS.STATUT]: 'En attente',
        [GRIST.RECOMMANDATIONS.FIELDS.PRIORITE]: 'Haute',
        [GRIST.RECOMMANDATIONS.FIELDS.COMITE_INVESTISSEMENT]: '2024-01-01'
      }
    }

    const result = mapGristRecommandationToRecommandation(gristRecommandation)

    expect(result).toEqual({
      id: 1,
      produitId: 123,
      recommandation: 'Test Recommandation - Description de test',
      statut: 'En attente',
      priorite: 'Haute',
      comiteInvestissement: '2024-01-01'
    })
  })

  it('should map GristRecommandation without optional fields', () => {
    const gristRecommandation: GristRecommandation = {
      id: 2,
      fields: {
        [GRIST.RECOMMANDATIONS.FIELDS.PRODUIT_ID]: 456,
        [GRIST.RECOMMANDATIONS.FIELDS.RECOMMANDATION]: 'Test Recommandation 2 - Description de test 2',
        [GRIST.RECOMMANDATIONS.FIELDS.STATUT]: 'En cours',
        [GRIST.RECOMMANDATIONS.FIELDS.COMITE_INVESTISSEMENT]: '2024-01-03'
      }
    }

    const result = mapGristRecommandationToRecommandation(gristRecommandation)

    expect(result).toEqual({
      id: 2,
      produitId: 456,
      recommandation: 'Test Recommandation 2 - Description de test 2',
      statut: 'En cours',
      priorite: undefined,
      comiteInvestissement: '2024-01-03'
    })
  })
})
