'use server'

import { Consommation } from '@/domain/types'
import { 
  findConsommationsByProduitId as findGristConsommationsByProduitId,
  findConsommationsDuDernierMois as findGristConsommationsDuDernierMois
} from '@/infrastructure/grist/repositories/consommationsGristRepository'

/**
 * Récupère toutes les consommations d'un produit
 */
export async function getConsommationsByProduitId(produitId: number): Promise<Consommation[]> {
  return findGristConsommationsByProduitId(produitId)
}

/**
 * Récupère les consommations du dernier mois pour un produit
 */
export async function getConsommationsDuDernierMois(produitId: number): Promise<Consommation[]> {
  return findGristConsommationsDuDernierMois(produitId)
}
