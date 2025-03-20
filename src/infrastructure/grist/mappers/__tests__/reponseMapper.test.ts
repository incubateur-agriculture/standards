import { describe, it, expect } from 'vitest'
import { mapGristReponseToReponse } from '../reponseMapper'
import { GRIST } from '@/infrastructure/grist/constants/gristConstants'
import { REPONSE_OPTIONS } from '@/domain/types'

describe('reponseMapper', () => {
    describe('mapGristReponseToReponse', () => {
        it('should map Grist response to domain response', () => {
            // Arrange
            const gristReponse = {
                id: 123,
                fields: {
                    [GRIST.REPONSES.FIELDS.AUDIT]: 456,
                    [GRIST.REPONSES.FIELDS.QUESTION]: 789,
                    [GRIST.REPONSES.FIELDS.REPONSE]: REPONSE_OPTIONS.OUI,
                    [GRIST.REPONSES.FIELDS.COMMENTAIRES]: 'Test comment',
                    [GRIST.REPONSES.FIELDS.POURCENTAGE]: 75
                }
            }

            // Act
            const result = mapGristReponseToReponse(gristReponse)

            // Assert
            expect(result).toEqual({
                id: 123,
                auditId: 456,
                questionId: 789,
                reponse: REPONSE_OPTIONS.OUI,
                commentaire: 'Test comment',
                pourcentage: 75
            })
        })

        it('should handle null values', () => {
            // Arrange
            const gristReponse = {
                id: 123,
                fields: {
                    [GRIST.REPONSES.FIELDS.AUDIT]: 456,
                    [GRIST.REPONSES.FIELDS.QUESTION]: 789,
                    [GRIST.REPONSES.FIELDS.REPONSE]: null,
                    [GRIST.REPONSES.FIELDS.COMMENTAIRES]: null,
                    [GRIST.REPONSES.FIELDS.POURCENTAGE]: null
                }
            }

            // Act
            const result = mapGristReponseToReponse(gristReponse)

            // Assert
            expect(result).toEqual({
                id: 123,
                auditId: 456,
                questionId: 789,
                reponse: null,
                commentaire: null,
                pourcentage: null
            })
        })
    })
}) 