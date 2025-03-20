import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getReponses, getReponse, saveReponse, reponseId, saveReponses } from '../reponsesRepository'
import { findReponsesByAuditId, findReponseByAuditAndQuestionId, saveReponseRecords } from '@/infrastructure/grist/repositories/reponsesGristRepository'
import { Reponse, REPONSE_OPTIONS } from '@/domain/types'

// Mock dependencies
vi.mock('@/infrastructure/grist/repositories/reponsesGristRepository', () => ({
    findReponsesByAuditId: vi.fn(),
    findReponseByAuditAndQuestionId: vi.fn(),
    saveReponseRecords: vi.fn()
}))

describe('reponsesRepository', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    describe('getReponses', () => {
        it('should get responses for an audit', async () => {
            // Arrange
            const mockReponses = [
                {
                    id: 1,
                    auditId: 123,
                    questionId: 456,
                    reponse: REPONSE_OPTIONS.OUI,
                    commentaire: 'Test comment',
                    pourcentage: 75
                }
            ]

            vi.mocked(findReponsesByAuditId).mockResolvedValue(mockReponses)

            // Act
            const result = await getReponses(123)

            // Assert
            expect(result).toEqual(mockReponses)
            expect(findReponsesByAuditId).toHaveBeenCalledWith(123)
        })

        it('should handle empty responses', async () => {
            // Arrange
            vi.mocked(findReponsesByAuditId).mockResolvedValue([])

            // Act
            const result = await getReponses(123)

            // Assert
            expect(result).toEqual([])
            expect(findReponsesByAuditId).toHaveBeenCalledWith(123)
        })
    })

    describe('getReponse', () => {
        it('should get a single response', async () => {
            // Arrange
            const mockReponse = {
                id: 1,
                auditId: 123,
                questionId: 456,
                reponse: REPONSE_OPTIONS.OUI,
                commentaire: 'Test comment',
                pourcentage: 75
            }

            vi.mocked(findReponseByAuditAndQuestionId).mockResolvedValue(mockReponse)

            // Act
            const result = await getReponse(123, 456)

            // Assert
            expect(result).toEqual(mockReponse)
            expect(findReponseByAuditAndQuestionId).toHaveBeenCalledWith(123, 456)
        })
    })

    describe('saveReponse with packing mechanism', () => {
        it('should pack multiple responses and save them together', async () => {
            // Arrange
            const mockReponse1: Reponse = {
                auditId: 123,
                questionId: 456,
                reponse: REPONSE_OPTIONS.OUI,
                commentaire: 'Test',
                pourcentage: null
            }

            const mockReponse2: Reponse = {
                auditId: 123,
                questionId: 457,
                reponse: REPONSE_OPTIONS.NON,
                commentaire: 'Test 2',
                pourcentage: 50
            }

            // Act
            await saveReponse(mockReponse1)
            await saveReponse(mockReponse2)

            // Fast-forward timer
            await vi.runAllTimersAsync()

            // Assert
            expect(vi.mocked(saveReponseRecords)).toHaveBeenCalledTimes(1)
            expect(vi.mocked(saveReponseRecords)).toHaveBeenCalledWith([mockReponse1, mockReponse2])
        })

        it('should force save when reaching more than 40 responses', async () => {
            // Arrange
            const responses: Reponse[] = Array.from({ length: 42 }, (_, i) => ({
                auditId: 123,
                questionId: i,
                reponse: REPONSE_OPTIONS.OUI,
                commentaire: `Test ${i}`,
                pourcentage: null
            }))

            // Act
            for (const response of responses) {
                await saveReponse(response)
            }

            // Assert
            expect(vi.mocked(saveReponseRecords)).toHaveBeenCalled()
        })
    })

    describe('saveReponses', () => {
        it('should save responses directly', async () => {
            // Arrange
            const responses: Reponse[] = [
                {
                    auditId: 123,
                    questionId: 456,
                    reponse: REPONSE_OPTIONS.OUI,
                    commentaire: 'Test',
                    pourcentage: null
                }
            ]

            // Act
            await saveReponses(responses)

            // Assert
            expect(saveReponseRecords).toHaveBeenCalledWith(responses)
        })

        it('should handle reset flag correctly', async () => {
            // Arrange
            const responses: Reponse[] = [
                {
                    auditId: 123,
                    questionId: 456,
                    reponse: null,
                    commentaire: null,
                    pourcentage: null,
                    reset: true
                }
            ]

            // Act
            await saveReponses(responses)

            // Assert
            expect(saveReponseRecords).toHaveBeenCalledWith(responses)
        })
    })

    describe('reponseId', () => {
        it('should generate correct response ID', async () => {
            // Arrange
            const reponse: Reponse = {
                auditId: 123,
                questionId: 456,
                reponse: REPONSE_OPTIONS.OUI,
                commentaire: null,
                pourcentage: null
            }

            // Act
            const result = await reponseId(reponse)

            // Assert
            expect(result).toBe('123-456')
        })
    })
}) 