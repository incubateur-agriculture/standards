import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getQuestions } from '../questionRepository'
import { findQuestions } from '@/infrastructure/grist/repositories/questionsGristRepository'
import { getReponses } from '../reponsesRepository'
import { getAudit, getPreviousAudit } from '../auditRepository'
import { Audit, Categorie, IMPORTANCE_OPTION, Question, Reponse, REPONSE_OPTIONS } from '@/domain/types'

// Mock dependencies
vi.mock('@/infrastructure/grist/repositories/questionsGristRepository', () => ({
    findQuestions: vi.fn()
}))

vi.mock('../reponsesRepository', () => ({
    getReponses: vi.fn()
}))

vi.mock('../auditRepository', () => ({
    getAudit: vi.fn(),
    getPreviousAudit: vi.fn()
}))

describe('questionRepository', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const mockAudit: Audit = {
        id: 123,
        dateComiteInvestissement: new Date('2024-01-01'),
        cloture: false,
        clotureLe: new Date('2024-01-01'),
        produit: {
            id: 456,
            nom: 'Test Product'
        }
    }

    const mockPreviousAudit: Audit = {
        id: 122,
        dateComiteInvestissement: new Date('2023-12-01'),
        cloture: true,
        clotureLe: new Date('2023-12-31'),
        produit: {
            id: 456,
            nom: 'Test Product'
        }
    }

    const mockReponses: Reponse[] = [
        {
            id: 1,
            questionId: 1,
            auditId: 123,
            reponse: REPONSE_OPTIONS.OUI,
            commentaire: 'Implemented',
            pourcentage: 100
        }
    ]

    const mockPreviousReponses: Reponse[] = [
        {
            id: 2,
            questionId: 1,
            auditId: 122,
            reponse: REPONSE_OPTIONS.NON,
            commentaire: 'Not implemented',
            pourcentage: 0
        }
    ]

    const mockCategories: Categorie[] = [
        {
            titre: 'Sécurité',
            questions: [
                {
                    id: 1,
                    question: 'La 2FA est-elle activée ?',
                    importance: IMPORTANCE_OPTION.P0,
                    tooltip: 'Double authentification',
                    reponse: mockReponses[0],
                    previousReponse: mockPreviousReponses[0]
                }
            ]
        }
    ]

    it('should return questions with current and previous responses', async () => {
        // Arrange
        vi.mocked(getAudit).mockResolvedValue(mockAudit)
        vi.mocked(getPreviousAudit).mockResolvedValue(mockPreviousAudit)
        vi.mocked(getReponses)
            .mockImplementation(async (auditId) => {
                if (auditId === mockAudit.id) return mockReponses
                if (auditId === mockPreviousAudit.id) return mockPreviousReponses
                return []
            })
        vi.mocked(findQuestions).mockResolvedValue(mockCategories)

        // Act
        const result = await getQuestions(456, 'test-hash')

        // Assert
        expect(result).toEqual(mockCategories)
        expect(getAudit).toHaveBeenCalledWith('test-hash')
        expect(getPreviousAudit).toHaveBeenCalledWith(456, 'test-hash')
        expect(getReponses).toHaveBeenCalledWith(mockAudit.id)
        expect(getReponses).toHaveBeenCalledWith(mockPreviousAudit.id)
        expect(findQuestions).toHaveBeenCalledWith(
            { '1': mockReponses[0] },
            { '1': mockPreviousReponses[0] }
        )
    })

    it('should return empty array when audit is not found', async () => {
        // Arrange
        vi.mocked(getAudit).mockResolvedValue(null)

        // Act
        const result = await getQuestions(456, 'non-existent-hash')

        // Assert
        expect(result).toEqual([])
        expect(getAudit).toHaveBeenCalledWith('non-existent-hash')
        expect(getPreviousAudit).not.toHaveBeenCalled()
        expect(getReponses).not.toHaveBeenCalled()
        expect(findQuestions).not.toHaveBeenCalled()
    })

    it('should handle case when no previous audit exists', async () => {
        // Arrange
        vi.mocked(getAudit).mockResolvedValue(mockAudit)
        vi.mocked(getPreviousAudit).mockResolvedValue(null)
        vi.mocked(getReponses).mockResolvedValue(mockReponses)
        vi.mocked(findQuestions).mockResolvedValue(mockCategories)

        // Act
        const result = await getQuestions(456, 'test-hash')

        // Assert
        expect(result).toEqual(mockCategories)
        expect(getAudit).toHaveBeenCalledWith('test-hash')
        expect(getPreviousAudit).toHaveBeenCalledWith(456, 'test-hash')
        expect(getReponses).toHaveBeenCalledWith(mockAudit.id)
        expect(findQuestions).toHaveBeenCalledWith(
            { '1': mockReponses[0] },
            {}
        )
    })

    it('should handle empty responses', async () => {
        // Arrange
        vi.mocked(getAudit).mockResolvedValue(mockAudit)
        vi.mocked(getPreviousAudit).mockResolvedValue(mockPreviousAudit)
        vi.mocked(getReponses).mockResolvedValue([])
        vi.mocked(findQuestions).mockResolvedValue([])

        // Act
        const result = await getQuestions(456, 'test-hash')

        // Assert
        expect(result).toEqual([])
        expect(getAudit).toHaveBeenCalledWith('test-hash')
        expect(getPreviousAudit).toHaveBeenCalledWith(456, 'test-hash')
        expect(getReponses).toHaveBeenCalledWith(mockAudit.id)
        expect(getReponses).toHaveBeenCalledWith(mockPreviousAudit.id)
        expect(findQuestions).toHaveBeenCalledWith({}, {})
    })

    it('should throw error when getAudit fails', async () => {
        // Arrange
        const error = new Error('Failed to fetch audit')
        vi.mocked(getAudit).mockRejectedValue(error)

        // Act & Assert
        await expect(getQuestions(456, 'test-hash')).rejects.toThrow(error)
        expect(getAudit).toHaveBeenCalledWith('test-hash')
        expect(getPreviousAudit).not.toHaveBeenCalled()
        expect(getReponses).not.toHaveBeenCalled()
        expect(findQuestions).not.toHaveBeenCalled()
    })

    it('should throw error when getReponses fails', async () => {
        // Arrange
        const error = new Error('Failed to fetch responses')
        vi.mocked(getAudit).mockResolvedValue(mockAudit)
        vi.mocked(getReponses).mockRejectedValue(error)

        // Act & Assert
        await expect(getQuestions(456, 'test-hash')).rejects.toThrow(error)
        expect(getAudit).toHaveBeenCalledWith('test-hash')
        expect(getReponses).toHaveBeenCalledWith(mockAudit.id)
    })

    it('should throw error when findQuestions fails', async () => {
        // Arrange
        const error = new Error('Failed to fetch questions')
        vi.mocked(getAudit).mockResolvedValue(mockAudit)
        vi.mocked(getReponses).mockResolvedValue(mockReponses)
        vi.mocked(findQuestions).mockRejectedValue(error)

        // Act & Assert
        await expect(getQuestions(456, 'test-hash')).rejects.toThrow(error)
        expect(getAudit).toHaveBeenCalledWith('test-hash')
        expect(getReponses).toHaveBeenCalledWith(mockAudit.id)
        expect(findQuestions).toHaveBeenCalled()
    })
}) 