import { Produit } from "@/domain/types"
import { apiClient } from "@/infrastructure/grist/client/gristApiClient"
import { GRIST } from "@/infrastructure/grist/constants/gristConstants"
import { GristProduit, mapGristProduitToProduit } from "@/infrastructure/grist/mappers/produitMapper"

export async function findProduitById(produitId: number): Promise<Produit|null> {
    const gristProduit = await getGristProduit(produitId)
    console.log(gristProduit);
    if (!gristProduit) {
        return null
    }
    return mapGristProduitToProduit(gristProduit)
}

export async function findAllProduits(): Promise<Produit[]> {
    const gristProduits = await getGristProduits()
    return gristProduits.map(mapGristProduitToProduit)
}

async function getGristProduit(produitId: number): Promise<GristProduit|null> {
    return (await apiClient.get(`/tables/${GRIST.PRODUITS.ID}/records`, {
        params: {
            filter: `{"${GRIST.PRODUITS.FIELDS.ID}":["${produitId}"]}`
        }
    })).data.records[0] ?? null
}

async function getGristProduits(): Promise<GristProduit[]> {
    return (await apiClient.get(`/tables/${GRIST.PRODUITS.ID}/records`))
        .data.records ?? []
} 