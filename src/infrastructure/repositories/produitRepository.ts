'use server'

import { ColumnOption, Produit } from "@/domain/types"
import { 
  fetchOutilsMutualisesOptions as fetchGristOutilsMutualisesOptions,
  fetchOutilsNonMutualisesOptions as fetchGristOutilsNonMutualisesOptions
} from "@/infrastructure/grist/repositories/columnsGristRepository"
import { 
  findAllProduits as findAllGristProduits,
  findProduitById as findGristProduitById,
  saveProduit as saveGristProduit
} from "@/infrastructure/grist/repositories/produitsGristRepository"

/**
 * Récupère un produit par son ID
 */
export async function getProduitById(produitId: number): Promise<Produit | null> {
  return findGristProduitById(produitId)
}

/**
 * Récupère tous les produits
 */
export async function getAllProduits(): Promise<Produit[]> {
  return findAllGristProduits()
}

/**
 * Sauvegarde un produit
 */
export async function saveProduit(produit: Produit): Promise<void> {
  return saveGristProduit(produit)
}

/**
 * Récupère les options pour les outils mutualisés
 */
export async function getOutilsMutualisesOptions(): Promise<ColumnOption[]> {
  return fetchGristOutilsMutualisesOptions()
}

/**
 * Récupère les options pour les outils non mutualisés
 */
export async function getOutilsNonMutualisesOptions(): Promise<ColumnOption[]> {
  return fetchGristOutilsNonMutualisesOptions()
}