'use server'

import { Produit, OutilsStartupsMapping } from "@/domain/types"
import { 
  findAllOutilsMutualises as findAllGristOutilsMutualises,
  findAllOutilsNonMutualises as findAllGristOutilsNonMutualises,
  findOutilsStartupsMapping as findGristOutilsStartupsMapping,
  editOutilsStartupsMapping as editGristOutilsStartupsMapping,
  deleteOutilsStartupsMapping as deleteGristOutilsStartupsMapping,
  createOutilNonMutualise as createGristOutilNonMutualise
} from "@/infrastructure/grist/repositories/outilsGristRepository"

/**
 * Récupère tous les outils mutualisés
 */
export async function getAllOutilsMutualises(): Promise<Produit[]> {
  return findAllGristOutilsMutualises()
}

/**
 * Récupère tous les outils non mutualisés
 */
export async function getAllOutilsNonMutualises(): Promise<Produit[]> {
  return findAllGristOutilsNonMutualises()
}

/**
 * Récupère les mappings Outils x Startups pour une startup spécifique
 * @param startupId - ID de la startup
 * @returns Promise<OutilsStartupsMapping[]> - Liste des mappings
 */
export async function getOutilsStartupsMapping(startupId: number): Promise<OutilsStartupsMapping[]> {
  if (!startupId) {
    return []
  }
  return findGristOutilsStartupsMapping(startupId)
}

/**
 * Met à jour un mapping Startup x Outils
 * @param mapping - Le mapping à mettre à jour
 * @returns Promise<OutilsStartupsMapping> - Le mapping mis à jour
 */
export async function editOutilsStartupsMapping(mapping: OutilsStartupsMapping): Promise<void> {
  await editGristOutilsStartupsMapping(mapping)
}

/**
 * Supprime un mapping Startup x Outils
 * @param mappingId - ID du mapping à supprimer
 * @returns Promise<void>
 */
export async function deleteOutilsStartupsMapping(mappingId: number): Promise<void> {
  await deleteGristOutilsStartupsMapping(mappingId)
}

/**
 * Crée un nouvel outil non mutualisé et l'associe à une startup
 * @param nomOutil - Nom de l'outil à créer
 * @param startupId - ID de la startup à associer
 * @returns Promise<Produit> - L'outil créé
 */
export async function createOutilNonMutualise(nomOutil: string, startupId: number): Promise<Produit> {
  return createGristOutilNonMutualise(nomOutil, startupId)
}
