import { Produit } from "@/domain/types"
import { GRIST } from "@/infrastructure/grist/constants/gristConstants"

const cleanGristArray = (array: string[] | undefined): string[] => {
    if (!array) return []
    return array[0] === 'L' ? array.slice(1) : array
}

export interface GristProduit {
    id: number
    fields: Record<string, string | string[] | undefined>
}

export function mapGristProduitToProduit(gristProduit: GristProduit): Produit {
    return {
        id: gristProduit.id,
        nom: gristProduit.fields[GRIST.PRODUITS.FIELDS.NOM] as string,
        startup: gristProduit.fields[GRIST.PRODUITS.FIELDS.STARTUP] as string,
        statut: gristProduit.fields[GRIST.PRODUITS.FIELDS.STATUT] as string,
        typeProjet: gristProduit.fields[GRIST.PRODUITS.FIELDS.TYPE_PROJET] as string,
        architecture: gristProduit.fields[GRIST.PRODUITS.FIELDS.ARCHITECTURE] as string,
        languages: cleanGristArray(gristProduit.fields[GRIST.PRODUITS.FIELDS.LANGUAGES] as string[]),
        description: gristProduit.fields[GRIST.PRODUITS.FIELDS.DESCRIPTION] as string,
        repository: gristProduit.fields[GRIST.PRODUITS.FIELDS.REPOSITORY] as string,
        homepage: gristProduit.fields[GRIST.PRODUITS.FIELDS.HOMEPAGE] as string,
        dependances: cleanGristArray(gristProduit.fields[GRIST.PRODUITS.FIELDS.DEPENDANCES] as string[]),
        outilsAas: cleanGristArray(gristProduit.fields[GRIST.PRODUITS.FIELDS.OUTILS_AAS] as string[]),
        hebergement: cleanGristArray(gristProduit.fields[GRIST.PRODUITS.FIELDS.HEBERGEMENT] as string[]),
        frontend: cleanGristArray(gristProduit.fields[GRIST.PRODUITS.FIELDS.FRONTEND] as string[]),
        backend: cleanGristArray(gristProduit.fields[GRIST.PRODUITS.FIELDS.BACKEND] as string[]),
        authentification: cleanGristArray(gristProduit.fields[GRIST.PRODUITS.FIELDS.AUTHENTIFICATION] as string[])
    }
} 