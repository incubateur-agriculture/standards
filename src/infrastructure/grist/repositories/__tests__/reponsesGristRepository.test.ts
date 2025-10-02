import { describe, it, expect, vi, beforeEach } from 'vitest'
import { findReponsesByAuditId, findReponseByAuditAndQuestionId, saveReponseRecords } from '../reponsesGristRepository'
import { apiClient } from '@/infrastructure/grist/client/gristApiClient'
import { GRIST } from '@/infrastructure/grist/constants/gristConstants'
import { REPONSE_OPTIONS, Reponse } from '@/domain/types'
import { mapGristReponseToReponse } from '@/infrastructure/grist/mappers/reponseMapper'

vi.mock('@/infrastructure/grist/client/gristApiClient', () => ({
    apiClient: {
        get: vi.fn(),
        put: vi.fn()
    }
}))

vi.mock('@/infrastructure/grist/mappers/reponseMapper', () => ({
    mapGristReponseToReponse: vi.fn()
}))

describe('reponsesGristRepository', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const mockGristReponse = {
        id: 123,
        fields: {
            [GRIST.REPONSES.FIELDS.AUDIT]: 456,
            [GRIST.REPONSES.FIELDS.QUESTION]: 789,
            [GRIST.REPONSES.FIELDS.REPONSE]: REPONSE_OPTIONS.OUI,
            [GRIST.REPONSES.FIELDS.COMMENTAIRES]: 'Test comment',
            [GRIST.REPONSES.FIELDS.POURCENTAGE]: 75
        }
    }

    const mockMappedReponse = {
        id: 123,
        auditId: 456,
        questionId: 789,
        reponse: REPONSE_OPTIONS.OUI,
        commentaire: 'Test comment',
        pourcentage: 75
    }

    describe('findReponsesByAuditId', () => {
        it('should return empty array when no responses found', async () => {
            // Arrange
            vi.mocked(apiClient.get).mockResolvedValue({ data: { records: [] } })

            // Act
            const result = await findReponsesByAuditId(456)

            // Assert
            expect(result).toEqual([])
            expect(apiClient.get).toHaveBeenCalledWith(
                `/tables/${GRIST.REPONSES.ID}/records`,
                {
                    params: {
                        filter: `{"${GRIST.REPONSES.FIELDS.AUDIT}": [456]}`
                    }
                }
            )
        })

        it('should return mapped responses when found', async () => {
            // Arrange
            vi.mocked(apiClient.get).mockResolvedValue({ 
                data: { records: [mockGristReponse] }
            })
            vi.mocked(mapGristReponseToReponse).mockReturnValue(mockMappedReponse)

            // Act
            const result = await findReponsesByAuditId(456)

            // Assert
            expect(result).toEqual([mockMappedReponse])
        })
    })

    describe('findReponseByAuditAndQuestionId', () => {
        it('should return mapped response when found', async () => {
            // Arrange
            vi.mocked(apiClient.get).mockResolvedValue({ 
                data: { records: [mockGristReponse] }
            })
            vi.mocked(mapGristReponseToReponse).mockReturnValue(mockMappedReponse)

            // Act
            const result = await findReponseByAuditAndQuestionId(456, 789)

            // Assert
            expect(result).toEqual(mockMappedReponse)
            expect(mapGristReponseToReponse).toHaveBeenCalledWith(mockGristReponse)

            expect(apiClient.get).toHaveBeenCalledWith(
                `/tables/${GRIST.REPONSES.ID}/records`,
                {
                    params: {
                        filter: `{"${GRIST.REPONSES.FIELDS.AUDIT}": [456], "${GRIST.REPONSES.FIELDS.QUESTION}": [789]}`
                    }
                }
            )
        })

        it('should return null when no response found', async () => {
            // Arrange
            vi.mocked(apiClient.get).mockResolvedValue({ data: { records: [] } })
            vi.mocked(mapGristReponseToReponse).mockReturnValue({
                id: undefined,
                auditId: 456,
                questionId: 789,
                reponse: null,
                commentaire: null,
                pourcentage: null
            })

            // Act
            const result = await findReponseByAuditAndQuestionId(456, 789)

            // Assert
            expect(result).toEqual({
                id: undefined,
                auditId: 456,
                questionId: 789,
                reponse: null,
                commentaire: null,
                pourcentage: null
            })
        })
    })

    describe('saveReponseRecords', () => {
        it('should save responses with correct format', async () => {
            // Arrange
            const reponses: Reponse[] = [{
                auditId: 456,
                questionId: 789,
                reponse: REPONSE_OPTIONS.OUI,
                commentaire: 'Test comment',
                pourcentage: 75,
                commentaireModified: false
            }]

            // Act
            await saveReponseRecords(reponses)

            // Assert
            expect(apiClient.put).toHaveBeenCalledWith(
                `/tables/${GRIST.REPONSES.ID}/records`,
                { 
                    records: [{
                        require: {
                            [GRIST.REPONSES.FIELDS.AUDIT]: 456,
                            [GRIST.REPONSES.FIELDS.QUESTION]: 789,
                        },
                        fields: {
                            [GRIST.REPONSES.FIELDS.REPONSE]: REPONSE_OPTIONS.OUI,
                            [GRIST.REPONSES.FIELDS.COMMENTAIRES]: 'Test comment',
                            [GRIST.REPONSES.FIELDS.POURCENTAGE]: 75
                        }
                    }]
                }
            )
        })

        it('should handle reset flag', async () => {
            // Arrange
            const reponses: Reponse[] = [{
                auditId: 456,
                questionId: 789,
                reponse: null,
                commentaire: null,
                pourcentage: null,
                reset: true
            }]

            // Act
            await saveReponseRecords(reponses)

            // Assert
            expect(apiClient.put).toHaveBeenCalledWith(
                `/tables/${GRIST.REPONSES.ID}/records`,
                { 
                    records: [{
                        require: {
                            [GRIST.REPONSES.FIELDS.AUDIT]: 456,
                            [GRIST.REPONSES.FIELDS.QUESTION]: 789,
                        },
                        fields: {
                            [GRIST.REPONSES.FIELDS.REPONSE]: null,
                            [GRIST.REPONSES.FIELDS.COMMENTAIRES]: null,
                            [GRIST.REPONSES.FIELDS.POURCENTAGE]: null
                        }
                    }]
                }
            )
        })

        it('should save null comment when commentaireModified is true', async () => {
            // Arrange
            const reponses: Reponse[] = [{
                auditId: 456,
                questionId: 789,
                reponse: REPONSE_OPTIONS.OUI,
                commentaire: null,
                pourcentage: 75,
                commentaireModified: true
            }]

            // Act
            await saveReponseRecords(reponses)

            // Assert
            expect(apiClient.put).toHaveBeenCalledWith(
                `/tables/${GRIST.REPONSES.ID}/records`,
                { 
                    records: [{
                        require: {
                            [GRIST.REPONSES.FIELDS.AUDIT]: 456,
                            [GRIST.REPONSES.FIELDS.QUESTION]: 789,
                        },
                        fields: {
                            [GRIST.REPONSES.FIELDS.REPONSE]: REPONSE_OPTIONS.OUI,
                            [GRIST.REPONSES.FIELDS.COMMENTAIRES]: null,
                            [GRIST.REPONSES.FIELDS.POURCENTAGE]: 75
                        }
                    }]
                }
            )
        })
    })
}) 