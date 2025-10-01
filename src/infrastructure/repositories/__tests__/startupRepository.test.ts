import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
  getStartupById, 
  getAllStartups, 
  getStartupsByIncubateur,
  getActiveStartups,
  saveStartup
} from '../startupRepository'
import { 
  findStartupById as findGristStartupById,
  findAllStartups as findAllGristStartups,
  findStartupsByIncubateur as findGristStartupsByIncubateur,
  findActiveStartups as findGristActiveStartups,
  saveStartup as saveGristStartup
} from '@/infrastructure/grist/repositories/startupsGristRepository'
import { Startup } from '@/domain/types'

// Mock the dependencies
vi.mock('@/infrastructure/grist/repositories/startupsGristRepository', () => ({
  findStartupById: vi.fn(),
  findAllStartups: vi.fn(),
  findStartupsByIncubateur: vi.fn(),
  findActiveStartups: vi.fn(),
  saveStartup: vi.fn()
}))

describe('startupRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getStartupById', () => {
    it('should call findGristStartupById with correct ID and return the result', async () => {
      // Arrange
      const startupId = 123
      const mockStartup: Startup = {
        id: startupId,
        nom: 'Test Startup',
        acronyme: 'TS',
        intra: 'Test Intra',
        actif: true,
        incubateur: 'Incubateur des territoires',
        statut: 'En construction',
        typologieProduit: 'Mono-Produit',
        baseRh: 'Test, User, Names',
        idCanalMattermost: 'startup-test',
        outilsStartups: ['Product', 'Développement']
      }
      
      vi.mocked(findGristStartupById).mockResolvedValueOnce(mockStartup)

      // Act
      const result = await getStartupById(startupId)

      // Assert
      expect(findGristStartupById).toHaveBeenCalledWith(startupId)
      expect(result).toEqual(mockStartup)
    })

    it('should return null when findGristStartupById returns null', async () => {
      // Arrange
      const startupId = 999
      vi.mocked(findGristStartupById).mockResolvedValueOnce(null)

      // Act
      const result = await getStartupById(startupId)

      // Assert
      expect(findGristStartupById).toHaveBeenCalledWith(startupId)
      expect(result).toBeNull()
    })
  })

  describe('getAllStartups', () => {
    it('should call findAllGristStartups and return the result', async () => {
      // Arrange
      const mockStartups: Startup[] = [
        {
          id: 1,
          nom: 'Startup 1',
          acronyme: 'S1',
          intra: 'Intra 1',
          actif: true,
          incubateur: 'Incubateur des territoires',
          statut: 'En construction',
          typologieProduit: 'Mono-Produit',
          baseRh: 'User 1, User 2',
          idCanalMattermost: 'startup-1',
          outilsStartups: ['Product', 'Développement']
        },
        {
          id: 2,
          nom: 'Startup 2',
          acronyme: 'S2',
          intra: 'Intra 2',
          actif: false,
          incubateur: 'Incubateur des territoires',
          statut: 'En production',
          typologieProduit: 'Pluri-Produits',
          baseRh: 'User 3, User 4',
          idCanalMattermost: 'startup-2',
          outilsStartups: ['Support', 'Déploiement']
        }
      ]
      
      vi.mocked(findAllGristStartups).mockResolvedValueOnce(mockStartups)

      // Act
      const result = await getAllStartups()

      // Assert
      expect(findAllGristStartups).toHaveBeenCalled()
      expect(result).toEqual(mockStartups)
    })
  })

  describe('getStartupsByIncubateur', () => {
    it('should call findGristStartupsByIncubateur with correct incubateur and return the result', async () => {
      // Arrange
      const incubateur = 'Incubateur des territoires'
      const mockStartups: Startup[] = [
        {
          id: 1,
          nom: 'Startup 1',
          acronyme: 'S1',
          intra: 'Intra 1',
          actif: true,
          incubateur: incubateur,
          statut: 'En construction',
          typologieProduit: 'Mono-Produit',
          baseRh: 'User 1, User 2',
          idCanalMattermost: 'startup-1',
          outilsStartups: ['Product', 'Développement']
        }
      ]
      
      vi.mocked(findGristStartupsByIncubateur).mockResolvedValueOnce(mockStartups)

      // Act
      const result = await getStartupsByIncubateur(incubateur)

      // Assert
      expect(findGristStartupsByIncubateur).toHaveBeenCalledWith(incubateur)
      expect(result).toEqual(mockStartups)
    })
  })

  describe('getActiveStartups', () => {
    it('should call findGristActiveStartups and return the result', async () => {
      // Arrange
      const mockActiveStartups: Startup[] = [
        {
          id: 1,
          nom: 'Active Startup 1',
          acronyme: 'AS1',
          intra: 'Intra 1',
          actif: true,
          incubateur: 'Incubateur des territoires',
          statut: 'En construction',
          typologieProduit: 'Mono-Produit',
          baseRh: 'User 1, User 2',
          idCanalMattermost: 'startup-1',
          outilsStartups: ['Product', 'Développement']
        }
      ]
      
      vi.mocked(findGristActiveStartups).mockResolvedValueOnce(mockActiveStartups)

      // Act
      const result = await getActiveStartups()

      // Assert
      expect(findGristActiveStartups).toHaveBeenCalled()
      expect(result).toEqual(mockActiveStartups)
    })
  })

  describe('saveStartup', () => {
    it('should call saveGristStartup with the provided startup', async () => {
      // Arrange
      const startup: Startup = {
        id: 123,
        nom: 'Test Startup',
        acronyme: 'TS',
        intra: 'Test Intra',
        actif: true,
        incubateur: 'Incubateur des territoires',
        statut: 'En construction',
        typologieProduit: 'Mono-Produit',
        baseRh: 'Test, User, Names',
        idCanalMattermost: 'startup-test',
        outilsStartups: ['Product', 'Développement']
      }
      
      vi.mocked(saveGristStartup).mockResolvedValueOnce()

      // Act
      await saveStartup(startup)

      // Assert
      expect(saveGristStartup).toHaveBeenCalledWith(startup)
    })

    it('should throw an error when saveGristStartup throws', async () => {
      // Arrange
      const startup: Startup = {
        id: 123,
        nom: 'Test Startup',
        acronyme: 'TS',
        intra: 'Test Intra',
        actif: true,
        incubateur: 'Incubateur des territoires',
        statut: 'En construction',
        typologieProduit: 'Mono-Produit',
        baseRh: 'Test, User, Names',
        idCanalMattermost: 'startup-test',
        outilsStartups: ['Product', 'Développement']
      }
      
      vi.mocked(saveGristStartup).mockRejectedValueOnce(new Error('Save error'))

      // Act & Assert
      await expect(saveStartup(startup)).rejects.toThrow('Save error')
    })
  })
})
