'use server'

import { Recommandation } from '@/domain/types'
import { 
  findRecommandationsByProduitId as findGristRecommandationsByProduitId,
  findRecommandationsByProduitIdAndStatut as findGristRecommandationsByProduitIdAndStatut,
  findRecommandationsNonFaitesByProduitId as findGristRecommandationsNonFaitesByProduitId,
  updateRecommandationStatut as updateGristRecommandationStatut
} from '@/infrastructure/grist/repositories/recommandationsGristRepository'

/**
 * Récupère toutes les recommandations d'un produit
 */
export async function getRecommandationsByProduitId(produitId: number): Promise<Recommandation[]> {
  return findGristRecommandationsByProduitId(produitId)
}

/**
 * Récupère les recommandations d'un produit avec un statut spécifique
 */
export async function getRecommandationsByProduitIdAndStatut(
  produitId: number, 
  statut: string
): Promise<Recommandation[]> {
  return findGristRecommandationsByProduitIdAndStatut(produitId, statut)
}

/**
 * Récupère les recommandations non faites d'un produit (statut différent de "Fait")
 */
export async function getRecommandationsNonFaitesByProduitId(produitId: number): Promise<Recommandation[]> {
  return findGristRecommandationsNonFaitesByProduitId(produitId)
}

/**
 * Met à jour le statut d'une recommandation
 */
export async function updateRecommandationStatut(
  recommandationId: number, 
  nouveauStatut: string
): Promise<void> {
  return updateGristRecommandationStatut(recommandationId, nouveauStatut)
}
