import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { Audit, Question as QuestionType, REPONSE_OPTIONS } from '@/domain/types'
import { mock } from 'vitest-mock-extended';
import QuestionReadonly from '../QuestionReadonly';

const audit = {
    ...mock<Audit>(),
    cloture: false,
};
const question = {
    ...mock<QuestionType>(), 
    question: 'Une question de toute première importance ?',
}

const createQuestionWithResponse = (reponse: REPONSE_OPTIONS | null, pourcentage = 0, commentaire = "") => ({
    ...question,
    reponse: reponse ? {
        auditId: audit.id,
        questionId: question.id,
        reponse,
        commentaire,
        pourcentage
    } : null
});

afterEach(() => {
    cleanup();
});

describe('Test QuestionReadonly component', async () => {
    it('should render properly with no response', async () => {
        const questionWithoutReponse = createQuestionWithResponse(null);
        render(<QuestionReadonly audit={audit} question={questionWithoutReponse} />)
        
        expect(screen.getByText('Une question de toute première importance ?')).toBeDefined();
        expect(screen.getByText('Non répondue')).toBeDefined();
    })

    it('should render properly with Oui response', async () => {
        const questionWithOui = createQuestionWithResponse(REPONSE_OPTIONS.OUI);
        render(<QuestionReadonly audit={audit} question={questionWithOui} />)
        
        expect(screen.getByText('Une question de toute première importance ?')).toBeDefined();
        expect(screen.getByText('Oui')).toBeDefined();
    })

    it('should render properly with Non response and pourcentage', async () => {
        const questionWithNon = createQuestionWithResponse(REPONSE_OPTIONS.NON, 50);
        render(<QuestionReadonly audit={audit} question={questionWithNon} />)
        
        expect(screen.getByText('Une question de toute première importance ?')).toBeDefined();
        expect(screen.getByText('Non (50%)')).toBeDefined();
    })

    it('should render properly with Ne sais pas response', async () => {
        const questionWithNeSaisPas = createQuestionWithResponse(REPONSE_OPTIONS.NE_SAIS_PAS);
        render(<QuestionReadonly audit={audit} question={questionWithNeSaisPas} />)
        
        expect(screen.getByText('Une question de toute première importance ?')).toBeDefined();
        expect(screen.getByText('Ne sais pas')).toBeDefined();
    })

    it('should render properly with Non applicable response', async () => {
        const questionWithNonApplicable = createQuestionWithResponse(REPONSE_OPTIONS.NON_APPLICABLE);
        render(<QuestionReadonly audit={audit} question={questionWithNonApplicable} />)
        
        expect(screen.getByText('Une question de toute première importance ?')).toBeDefined();
        expect(screen.getByText('Non applicable')).toBeDefined();
    })

    it('should render properly with comment', async () => {
        const questionWithComment = createQuestionWithResponse(REPONSE_OPTIONS.OUI, 0, "Test comment");
        render(<QuestionReadonly audit={audit} question={questionWithComment} />)
        
        expect(screen.getByText('Une question de toute première importance ?')).toBeDefined();
        expect(screen.getByText('Test comment')).toBeDefined();
    })
})