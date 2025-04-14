import { afterEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { Audit, Question as QuestionType } from '@/domain/types'
import { mock } from 'vitest-mock-extended'
import Question from '../Question'

const audit = {
    ...mock<Audit>(),
    id: 1,
    cloture: false,
};
const question = {
    ...mock<QuestionType>(), 
    id: 1,
    question: 'Une question de toute première importance ?',
}
afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.clearAllTimers();
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
        
        await waitFor(() => {
            expect(handleChange).toHaveBeenCalledWith({
                auditId: audit.id,
                questionId: question.id,
                reponse: "Oui",
                commentaire: "",
                pourcentage: 0
            });
        }, { timeout: 2000 });
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
        }, { timeout: 2000 });
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
        }, { timeout: 2000 });
    });

    it('should not call onChange when event target has no name or value', async () => {
        const handleChange = vi.fn();
        
        render(<Question audit={audit} question={question} onChange={handleChange}/>);
        
        // Simulate event without name using userEvent
        const radio = screen.getByLabelText("Oui");
        await userEvent.click(radio);
        
        // Override the name property of the input
        const input = screen.getByRole('radio', { name: 'Oui' });
        Object.defineProperty(input, 'name', { value: '' });
        
        // Trigger change event
        input.dispatchEvent(new Event('change', { bubbles: true }));
        
        await waitFor(() => {
            expect(handleChange).not.toHaveBeenCalled();
        }, { timeout: 2000 });
    });

    it('should handle error when onChange fails', async () => {
        const handleChange = vi.fn().mockRejectedValue(new Error('Test error'));
        
        render(<Question audit={audit} question={question} onChange={handleChange}/>);
        
        screen.getByLabelText("Oui").click();
        
        await waitFor(() => {
            expect(screen.getByText("Votre réponse n'a pas été enregistrée. Erreur : Test error")).toBeDefined();
        }, { timeout: 2000 });
    });

    it('should cleanup timeout on unmount', async () => {
        const handleChange = vi.fn();
        const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
        
        const { unmount } = render(<Question audit={audit} question={question} onChange={handleChange}/>);
        
        screen.getByLabelText("Oui").click();
        unmount();
        
        expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    it('should reset state and call onChange when clicking reset', async () => {
        const handleChange = vi.fn();
        
        render(<Question audit={audit} question={question} onChange={handleChange}/>);
        
        // First answer the question
        screen.getByLabelText("Oui").click();
        await screen.findByText("Répondue");
        
        // Then click reset
        screen.getByTitle("Reset").click();
        
        await waitFor(() => {
            expect(handleChange).toHaveBeenCalledWith({
                auditId: audit.id,
                questionId: question.id,
                reponse: null,
                commentaire: "",
                pourcentage: 0,
                reset: true
            });
        }, { timeout: 2000 });
        
        // Verify state is reset
        expect(screen.queryByText("Répondue")).toBeNull();
    });
})

describe('Test Question component in display mode', async () => {
    
    it('should render properly', async () => {
        render(<Question audit={{...audit, cloture: true}} question={question} onChange={() => {}}/>)
        expect(screen.getByText('Une question de toute première importance ?')).toBeDefined();
    })
})