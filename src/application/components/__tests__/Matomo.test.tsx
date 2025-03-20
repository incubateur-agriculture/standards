import { test } from 'vitest'
import { render } from '@testing-library/react'
import { Matomo } from '../Matomo';

test('Matomo', () => {
    render(<Matomo />)
})