'use server'

import { Produit } from "@/domain/types"
import { findProduitById, findAllProduits } from "@/infrastructure/grist/repositories/produitsGristRepository"

export async function getProduit(id: number): Promise<Produit|null> {
    return findProduitById(id)
}

export async function getProduits(): Promise<Produit[]> {
    return findAllProduits()
} 