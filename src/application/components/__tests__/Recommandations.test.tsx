import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Recommandations from '../Recommandations'
import * as recommandationsRepository from '@/infrastructure/repositories/recommandationsRepository'

// Mock the repository
vi.mock('@/infrastructure/repositories/recommandationsRepository', () => ({
  getRecommandationsNonFaitesByProduitId: vi.fn(),
  updateRecommandationStatut: vi.fn()
}))

const mockRepository = vi.mocked(recommandationsRepository)

describe('Recommandations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display loading state initially', () => {
    mockRepository.getRecommandationsNonFaitesByProduitId.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )

    render(<Recommandations produitId={123} />)

    expect(screen.getByText('Chargement des recommandations...')).toBeInTheDocument()
  })

  it('should display error message when fetch fails', async () => {
    mockRepository.getRecommandationsNonFaitesByProduitId.mockRejectedValue(
      new Error('Fetch failed')
    )

    render(<Recommandations produitId={123} />)

    await waitFor(() => {
      expect(screen.getByText('Fetch failed')).toBeInTheDocument()
    })
  })

  it('should display no recommendations message when empty', async () => {
    mockRepository.getRecommandationsNonFaitesByProduitId.mockResolvedValue([])

    render(<Recommandations produitId={123} />)

    await waitFor(() => {
      expect(screen.getByText('Aucune recommandation en attente pour ce produit.')).toBeInTheDocument()
    })
  })

  it('should display recommendations when available', async () => {
    const mockRecommandations = [
      {
        id: 1,
        produitId: 123,
        recommandation: 'Test Recommandation 1 - Description 1',
        statut: 'En attente',
        priorite: 'Haute',
        comiteInvestissement: '2024-01-01'
      },
      {
        id: 2,
        produitId: 123,
        recommandation: 'Test Recommandation 2 - Description 2',
        statut: 'En cours',
        comiteInvestissement: '2024-01-03'
      }
    ]

    mockRepository.getRecommandationsNonFaitesByProduitId.mockResolvedValue(mockRecommandations)

    render(<Recommandations produitId={123} />)

    await waitFor(() => {
      expect(screen.getByText('Recommandations en cours (2)')).toBeInTheDocument()
      expect(screen.getByText('Test Recommandation 1 - Description 1')).toBeInTheDocument()
      expect(screen.getByText('Test Recommandation 2 - Description 2')).toBeInTheDocument()
      expect(screen.getByText('En attente')).toBeInTheDocument()
      expect(screen.getAllByText('En cours')).toHaveLength(3) // 1 badge + 2 options dans les selects
      expect(screen.getByText('Haute')).toBeInTheDocument()
    })
  })

  it('should update statut when select changes', async () => {
    const mockRecommandations = [
      {
        id: 1,
        produitId: 123,
        recommandation: 'Test Recommandation - Description',
        statut: 'En attente',
        comiteInvestissement: '2024-01-01'
      }
    ]

    mockRepository.getRecommandationsNonFaitesByProduitId.mockResolvedValue(mockRecommandations)
    mockRepository.updateRecommandationStatut.mockResolvedValue()

    render(<Recommandations produitId={123} />)

    await waitFor(() => {
      expect(screen.getByText('Test Recommandation - Description')).toBeInTheDocument()
    })

    const selectElements = screen.getAllByRole('combobox')
    const selectElement = selectElements[selectElements.length - 1] // Prendre le dernier (celui du test actuel)
    fireEvent.change(selectElement, { target: { value: 'Fait' } })

    await waitFor(() => {
      expect(mockRepository.updateRecommandationStatut).toHaveBeenCalledWith(1, 'Fait')
    })
  })

  it('should display updating state during statut update', async () => {
    const mockRecommandations = [
      {
        id: 1,
        produitId: 123,
        recommandation: 'Test Recommandation - Description',
        statut: 'En attente',
        comiteInvestissement: '2024-01-01'
      }
    ]

    mockRepository.getRecommandationsNonFaitesByProduitId.mockResolvedValue(mockRecommandations)
    mockRepository.updateRecommandationStatut.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    )

    render(<Recommandations produitId={123} />)

    await waitFor(() => {
      expect(screen.getByText('Test Recommandation - Description')).toBeInTheDocument()
    })

    const selectElements = screen.getAllByRole('combobox')
    const selectElement = selectElements[selectElements.length - 1] // Prendre le dernier (celui du test actuel)
    fireEvent.change(selectElement, { target: { value: 'Fait' } })

    await waitFor(() => {
      expect(screen.getByText('Mise à jour...')).toBeInTheDocument()
    })
  })
})
