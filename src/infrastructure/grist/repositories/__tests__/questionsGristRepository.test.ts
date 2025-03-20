import { describe, it, expect, vi, beforeEach } from 'vitest'
import { findQuestions } from '../questionsGristRepository'
import { apiClient } from '@/infrastructure/grist/client/gristApiClient'
import { GRIST } from '@/infrastructure/grist/constants/gristConstants'
import { IMPORTANCE_OPTION, REPONSE_OPTIONS, Reponse } from '@/domain/types'

vi.mock('@/infrastructure/grist/client/gristApiClient', () => ({
    apiClient: {
        get: vi.fn()
    }
}))

describe('questionsGristRepository', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const mockReponses: Record<string, Reponse> = {
        '1': {
            id: 1,
            auditId: 123,
            questionId: 1,
            reponse: REPONSE_OPTIONS.OUI,
            commentaire: 'Test comment',
            pourcentage: 75
        }
    }

    const mockPreviousReponses: Record<string, Reponse> = {
        '1': {
            id: 2,
            auditId: 122,
            questionId: 1,
            reponse: REPONSE_OPTIONS.NON,
            commentaire: 'Previous comment',
            pourcentage: 0
        }
    }

    const mockGristQuestions = {
        records: [
            {
                id: 1,
                fields: {
                    [GRIST.QUESTIONS.FIELDS.CATEGORIE]: 'Sécurité',
                    [GRIST.QUESTIONS.FIELDS.QUESTION]: 'La 2FA est-elle activée ?',
                    [GRIST.QUESTIONS.FIELDS.IMPORTANCE]: IMPORTANCE_OPTION.P0,
                    [GRIST.QUESTIONS.FIELDS.TOOLTIP]: 'Double authentification',
                    [GRIST.QUESTIONS.FIELDS.STATUT]: 'Validée'
                }
            },
            {
                id: 2,
                fields: {
                    [GRIST.QUESTIONS.FIELDS.CATEGORIE]: 'Sécurité',
                    [GRIST.QUESTIONS.FIELDS.QUESTION]: 'Les mots de passe sont-ils sécurisés ?',
                    [GRIST.QUESTIONS.FIELDS.IMPORTANCE]: IMPORTANCE_OPTION.P1,
                    [GRIST.QUESTIONS.FIELDS.TOOLTIP]: 'Politique de mot de passe',
                    [GRIST.QUESTIONS.FIELDS.STATUT]: 'Validée'
                }
            }
        ]
    }

    it('should return questions grouped by categories with responses', async () => {
        // Arrange
        vi.mocked(apiClient.get).mockResolvedValue({ data: mockGristQuestions })

        // Act
        const result = await findQuestions(mockReponses, mockPreviousReponses)

        // Assert
        expect(result).toEqual([
            {
                titre: 'Sécurité',
                questions: [
                    {
                        id: 1,
                        question: 'La 2FA est-elle activée ?',
                        importance: IMPORTANCE_OPTION.P0,
                        tooltip: 'Double authentification',
                        reponse: mockReponses['1'],
                        previousReponse: mockPreviousReponses['1']
                    },
                    {
                        id: 2,
                        question: 'Les mots de passe sont-ils sécurisés ?',
                        importance: IMPORTANCE_OPTION.P1,
                        tooltip: 'Politique de mot de passe',
                        reponse: null,
                        previousReponse: null
                    }
                ]
            }
        ])

        expect(apiClient.get).toHaveBeenCalledWith(
            `/tables/${GRIST.QUESTIONS.ID}/records`,
            {
                params: {
                    sort: 'manualSort',
                    filter: `{"${GRIST.QUESTIONS.FIELDS.STATUT}": ["Validée"]}`
                }
            }
        )
    })

    it('should handle empty responses', async () => {
        // Arrange
        vi.mocked(apiClient.get).mockResolvedValue({ data: mockGristQuestions })

        // Act
        const result = await findQuestions({}, {})

        // Assert
        expect(result).toEqual([
            {
                titre: 'Sécurité',
                questions: [
                    {
                        id: 1,
                        question: 'La 2FA est-elle activée ?',
                        importance: IMPORTANCE_OPTION.P0,
                        tooltip: 'Double authentification',
                        reponse: null,
                        previousReponse: null
                    },
                    {
                        id: 2,
                        question: 'Les mots de passe sont-ils sécurisés ?',
                        importance: IMPORTANCE_OPTION.P1,
                        tooltip: 'Politique de mot de passe',
                        reponse: null,
                        previousReponse: null
                    }
                ]
            }
        ])
    })

    it('should handle empty questions', async () => {
        // Arrange
        vi.mocked(apiClient.get).mockResolvedValue({ data: { records: [] } })

        // Act
        const result = await findQuestions(mockReponses, mockPreviousReponses)

        // Assert
        expect(result).toEqual([])
    })

    it('should handle error from Grist API', async () => {
        // Arrange
        const error = new Error('Failed to fetch questions')
        vi.mocked(apiClient.get).mockRejectedValue(error)

        // Act & Assert
        await expect(findQuestions({}, {})).rejects.toThrow('Failed to fetch questions')
    })
}) 