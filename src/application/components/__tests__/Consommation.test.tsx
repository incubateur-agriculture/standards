import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Consommation from '../Consommation'
import { getConsommationsDuDernierMois } from '@/infrastructure/repositories/consommationRepository'

// Mock the repository function
vi.mock('@/infrastructure/repositories/consommationRepository', () => ({
  getConsommationsDuDernierMois: vi.fn()
}))

describe('Consommation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display loading state initially', () => {
    render(<Consommation produitId={123} />)
    
    expect(screen.getByText('Chargement des consommations...')).toBeInTheDocument()
    expect(screen.getByText('Consommations d\'infrastructure du dernier mois')).toBeInTheDocument()
  })

  it('should display consommations when data is loaded', async () => {
    const mockConsommations = [
      {
        id: 1,
        produitId: 123,
        outil: 'AWS EC2',
        cout: 150.50,
        detail: 'Instance t3.medium',
        date: new Date('2024-01-15T10:30:00Z')
      },
      {
        id: 2,
        produitId: 123,
        outil: 'MongoDB Atlas',
        cout: 75.00,
        detail: 'Cluster M10',
        date: new Date('2024-01-20T10:30:00Z')
      }
    ]

    vi.mocked(getConsommationsDuDernierMois).mockResolvedValueOnce(mockConsommations)

    render(<Consommation produitId={123} />)

    await waitFor(() => {
      expect(screen.getByText('Consommations d\'infrastructure du dernier mois (225,50 €)')).toBeInTheDocument()
    })

    expect(screen.getByText('AWS EC2')).toBeInTheDocument()
    expect(screen.getByText('150,50 €')).toBeInTheDocument()
    expect(screen.getByText('Instance t3.medium')).toBeInTheDocument()
    expect(screen.getByText('MongoDB Atlas')).toBeInTheDocument()
    expect(screen.getByText('75,00 €')).toBeInTheDocument()
    expect(screen.getByText('Cluster M10')).toBeInTheDocument()
  })

  it('should display error message when server action fails', async () => {
    vi.mocked(getConsommationsDuDernierMois).mockRejectedValueOnce(new Error('Server error'))

    render(<Consommation produitId={123} />)

    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument()
    })
    
    // Use getAllByText to get all elements with this text and check that at least one exists
    const accordionTitles = screen.getAllByText('Consommations d\'infrastructure du dernier mois')
    expect(accordionTitles.length).toBeGreaterThan(0)
  })

  it('should display no data message when no consommations', async () => {
    vi.mocked(getConsommationsDuDernierMois).mockResolvedValueOnce([])

    render(<Consommation produitId={123} />)

    await waitFor(() => {
      expect(screen.getByText('Aucune consommation enregistrée pour le dernier mois.')).toBeInTheDocument()
    })
    
    // Use getAllByText to get all elements with this text and check that at least one exists
    const accordionTitles = screen.getAllByText('Consommations d\'infrastructure du dernier mois')
    expect(accordionTitles.length).toBeGreaterThan(0)
  })

  it('should call server action with correct produitId', async () => {
    vi.mocked(getConsommationsDuDernierMois).mockResolvedValueOnce([])

    render(<Consommation produitId={123} />)

    await waitFor(() => {
      expect(getConsommationsDuDernierMois).toHaveBeenCalledWith(123)
    })
  })

  it('should display correct total cost in accordion title', async () => {
    const mockConsommations = [
      {
        id: 1,
        produitId: 123,
        outil: 'AWS EC2',
        cout: 100.00,
        detail: 'Instance t3.medium',
        date: new Date('2024-01-15T10:30:00Z')
      },
      {
        id: 2,
        produitId: 123,
        outil: 'MongoDB Atlas',
        cout: 50.25,
        detail: 'Cluster M10',
        date: new Date('2024-01-20T10:30:00Z')
      }
    ]

    vi.mocked(getConsommationsDuDernierMois).mockResolvedValueOnce(mockConsommations)

    render(<Consommation produitId={123} />)

    await waitFor(() => {
      expect(screen.getByText('Consommations d\'infrastructure du dernier mois (150,25 €)')).toBeInTheDocument()
    })
  })
})
