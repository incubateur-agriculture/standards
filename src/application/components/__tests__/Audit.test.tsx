import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Audit as AuditType, Categorie as CategorieType, Question } from '@/domain/types'
import { mock } from 'vitest-mock-extended';
import Audit from '../Audit';

const audit = mock<AuditType>();
const categories = [{
    ...mock<CategorieType>(),
    titre: 'Titre de catégorie',
    questions: [{
         ...mock<Question>(), 
         question: 'Une question de toute première importance ?'
    }]
}]

test('Audit', () => {
    render(<Audit audit={audit} categories={categories}/>)

    expect(screen.getByTitle('Titre de catégorie')).toBeDefined()
    expect(screen.getByText('Une question de toute première importance ?')).toBeDefined();
})