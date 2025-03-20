import { afterEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { Audit, Question as QuestionType } from '@/domain/types'
import { mock } from 'vitest-mock-extended'
import Question from '../Question'

const audit = {
    ...mock<Audit>(),
    cloture: false,
};
const question = {
    ...mock<QuestionType>(), 
    question: 'Une question de toute première importance ?',
}
afterEach(() => {
    cleanup();
});

describe('Test Question component in form mode', async () => {
    
    it('should render properly in form mode', async () => {
        render(<Question audit={audit} question={question} onChange={() => {}}/>)
        expect(screen.getByText('Une question de toute première importance ?')).toBeDefined();
    })

    it('should call onChange with correct value when clicking Oui', async () => {
        const handleChange = vi.fn();
        
        render(<Question audit={audit} question={question} onChange={handleChange}/>)
        screen.getByLabelText("Oui").click()
        
        await screen.findByText("Répondue");
        
        expect(handleChange).toHaveBeenCalledWith({
            auditId: audit.id,
            questionId: question.id,
            reponse: "Oui",
            commentaire: "",
            pourcentage: 0
        });
    })

    it('should show range and handle pourcentage when clicking Non', async () => {
        const handleChange = vi.fn();
        
        render(<Question audit={audit} question={question} onChange={handleChange}/>)
        
        // Click Non
        screen.getByLabelText("Non").click()
        
        // Verify range appears
        const range = await screen.findByRole('slider');
        expect(range).toBeDefined();
                
        await waitFor(() => {
            expect(handleChange).toHaveBeenCalledWith({
                auditId: audit.id,
                questionId: question.id,
                reponse: "Non",
                commentaire: "",
                pourcentage: 0
            });
        });
    })

    it('should handle textarea changes and call onChange', async () => {
        const handleChange = vi.fn();
        
        render(<Question audit={audit} question={question} onChange={handleChange}/>);
        
        const textarea = screen.getByPlaceholderText('Commentaires / détails');
        await userEvent.type(textarea, 'Test comment');
        
        await waitFor(() => {
            expect(handleChange).toHaveBeenCalledWith({
                auditId: audit.id,
                questionId: question.id,
                reponse: null,
                commentaire: 'Test comment',
                pourcentage: 0
            });
        });
    });
})

describe('Test Question component in display mode', async () => {
    
    it('should render properly', async () => {
        render(<Question audit={{...audit, cloture: true}} question={question} onChange={() => {}}/>)
        expect(screen.getByText('Une question de toute première importance ?')).toBeDefined();
    })
})