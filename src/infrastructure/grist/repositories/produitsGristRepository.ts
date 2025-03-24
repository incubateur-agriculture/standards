import { Produit } from "@/domain/types"
import { apiClient } from "@/infrastructure/grist/client/gristApiClient"
import { GRIST } from "@/infrastructure/grist/constants/gristConstants"
import { GristProduit, mapGristProduitToProduit } from "@/infrastructure/grist/mappers/produitMapper"

export async function findProduitById(produitId: number): Promise<Produit|null> {
    const gristProduit = await getGristProduit(produitId)

    if (!gristProduit) {
        return null
    }
    return mapGristProduitToProduit(gristProduit)
}

export async function findAllProduits(): Promise<Produit[]> {
    const gristProduits = await getGristProduits()
    return gristProduits.map(gristProduit => mapGristProduitToProduit(gristProduit))
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

/**
 * Sauvegarde un produit dans Grist
 * @param produit Le produit à sauvegarder
 * @returns Promise<void>
 */
export async function saveProduit(produit: Produit): Promise<void> {
    // Vérification
    if (!produit || !produit.id) {
        throw new Error("Produit invalide ou ID manquant");
    }

    // Structure de la requête pour Grist
    const gristRecord = {
        records: [
            {
                id: produit.id, // ID explicite pour s'assurer qu'il est bien pris en compte
                fields: {
                    // Champs à mettre à jour (tous explicitement pour s'assurer que rien n'est perdu)
                    /*
                    [GRIST.PRODUITS.FIELDS.NOM]: produit.nom || "",
                    [GRIST.PRODUITS.FIELDS.DESCRIPTION]: produit.description || "",
                    [GRIST.PRODUITS.FIELDS.STATUT]: produit.statut || null,
                    [GRIST.PRODUITS.FIELDS.TYPE_PROJET]: produit.typeProjet || null,
                    [GRIST.PRODUITS.FIELDS.ARCHITECTURE]: produit.architecture || null,
                    [GRIST.PRODUITS.FIELDS.REPOSITORY]: produit.repository || "",
                    [GRIST.PRODUITS.FIELDS.HOMEPAGE]: produit.homepage || "",
                    
                    // Arrays - s'assurer qu'ils sont traités comme des tableaux
                    [GRIST.PRODUITS.FIELDS.LANGUAGES]: Array.isArray(produit.languages) ? produit.languages : [],
                    [GRIST.PRODUITS.FIELDS.DEPENDANCES]: Array.isArray(produit.dependances) ? produit.dependances : [],
                    */
                    [GRIST.PRODUITS.FIELDS.OUTILS_MUTUALISES]: Array.isArray(produit.outilsMutualises) ? ['L', ...produit.outilsMutualises] : [],
                    [GRIST.PRODUITS.FIELDS.OUTILS_NON_MUTUALISES]: Array.isArray(produit.outilsNonMutualises) ? ['L', ...produit.outilsNonMutualises] : [],
                    /*
                    [GRIST.PRODUITS.FIELDS.HEBERGEMENT]: Array.isArray(produit.hebergement) ? produit.hebergement : [],
                    [GRIST.PRODUITS.FIELDS.FRONTEND]: Array.isArray(produit.frontend) ? produit.frontend : [],
                    [GRIST.PRODUITS.FIELDS.BACKEND]: Array.isArray(produit.backend) ? produit.backend : [],
                    [GRIST.PRODUITS.FIELDS.AUTHENTIFICATION]: Array.isArray(produit.authentification) ? produit.authentification : [],
                    */
                }
            }
        ]
    };

    try {
        const response = await apiClient.patch(`/tables/${GRIST.PRODUITS.ID}/records`, gristRecord);
        
        if (response.status !== 200) {
            console.error("Error saving product:", response.data);
            throw new Error(`Error saving product: ${response.status}`);
        }
        
        return;
    } catch (error) {
        console.error("Exception when saving product:", error);
        throw error;
    }
}