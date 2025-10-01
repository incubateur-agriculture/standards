import { describe, it, expect } from 'vitest'
import { mapGristStartupToStartup, GristStartup } from '../startupMapper'
import { GRIST } from '@/infrastructure/grist/constants/gristConstants'
import { Startup } from '@/domain/types'

describe('startupMapper', () => {
  describe('mapGristStartupToStartup', () => {
    it('should correctly map a Grist startup to a domain Startup', () => {
      // Arrange
      const gristStartup: GristStartup = {
        id: 123,
        fields: {
          [GRIST.STARTUPS.FIELDS.NOM]: 'Test Startup',
          [GRIST.STARTUPS.FIELDS.ACRONYME]: 'TS',
          [GRIST.STARTUPS.FIELDS.INTRA]: 'Test Intra',
          [GRIST.STARTUPS.FIELDS.ACTIF]: true,
          [GRIST.STARTUPS.FIELDS.INCUBATEUR]: 'Incubateur des territoires',
          [GRIST.STARTUPS.FIELDS.STATUT]: 'En construction',
          [GRIST.STARTUPS.FIELDS.TYPOLOGIE_PRODUIT]: 'Mono-Produit',
          [GRIST.STARTUPS.FIELDS.BASE_RH]: 'Test, User, Names',
          [GRIST.STARTUPS.FIELDS.ID_CANAL_MATTERMOST]: 'startup-test',
          [GRIST.STARTUPS.FIELDS.OUTILS_STARTUPS]: ['L', 'Product', 'Développement', 'Support']
        }
      }

      // Act
      const result = mapGristStartupToStartup(gristStartup)

      // Assert
      const expected: Startup = {
        id: 123,
        nom: 'Test Startup',
        acronyme: 'TS',
        intra: 'Test Intra',
        actif: true,
        incubateur: 'Incubateur des territoires',
        statut: 'En construction',
        typologieProduit: 'Mono-Produit',
        baseRh: 'Test, User, Names',
        idCanalMattermost: 'startup-test',
        outilsStartups: ['Product', 'Développement', 'Support']
      }
      expect(result).toEqual(expected)
    })

    it('should handle undefined optional fields', () => {
      // Arrange
      const gristStartup: GristStartup = {
        id: 123,
        fields: {
          [GRIST.STARTUPS.FIELDS.NOM]: 'Test Startup',
          [GRIST.STARTUPS.FIELDS.ACRONYME]: 'TS',
          [GRIST.STARTUPS.FIELDS.INTRA]: 'Test Intra',
          [GRIST.STARTUPS.FIELDS.ACTIF]: true,
          [GRIST.STARTUPS.FIELDS.INCUBATEUR]: 'Incubateur des territoires'
          // Optional fields are intentionally missing
        }
      }

      // Act
      const result = mapGristStartupToStartup(gristStartup)

      // Assert
      expect(result.statut).toBeUndefined()
      expect(result.typologieProduit).toBeUndefined()
      expect(result.baseRh).toBeUndefined()
      expect(result.idCanalMattermost).toBeUndefined()
      expect(result.outilsStartups).toEqual([])
    })

    it('should handle arrays without the "L" prefix', () => {
      // Arrange
      const gristStartup: GristStartup = {
        id: 123,
        fields: {
          [GRIST.STARTUPS.FIELDS.NOM]: 'Test Startup',
          [GRIST.STARTUPS.FIELDS.ACRONYME]: 'TS',
          [GRIST.STARTUPS.FIELDS.INTRA]: 'Test Intra',
          [GRIST.STARTUPS.FIELDS.ACTIF]: true,
          [GRIST.STARTUPS.FIELDS.INCUBATEUR]: 'Incubateur des territoires',
          [GRIST.STARTUPS.FIELDS.OUTILS_STARTUPS]: ['Product', 'Développement'] // No 'L' prefix
        }
      }

      // Act
      const result = mapGristStartupToStartup(gristStartup)

      // Assert
      expect(result.outilsStartups).toEqual(['Product', 'Développement'])
    })

    it('should handle empty arrays', () => {
      // Arrange
      const gristStartup: GristStartup = {
        id: 123,
        fields: {
          [GRIST.STARTUPS.FIELDS.NOM]: 'Test Startup',
          [GRIST.STARTUPS.FIELDS.ACRONYME]: 'TS',
          [GRIST.STARTUPS.FIELDS.INTRA]: 'Test Intra',
          [GRIST.STARTUPS.FIELDS.ACTIF]: true,
          [GRIST.STARTUPS.FIELDS.INCUBATEUR]: 'Incubateur des territoires',
          [GRIST.STARTUPS.FIELDS.OUTILS_STARTUPS]: []
        }
      }

      // Act
      const result = mapGristStartupToStartup(gristStartup)

      // Assert
      expect(result.outilsStartups).toEqual([])
    })
  })
})
