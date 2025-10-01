'use server'

import { Produit, OutilsStartupsMapping, GristPutRecord, GristGetRecord, GristPostRecord } from "@/domain/types"
import { apiClient } from "@/infrastructure/grist/client/gristApiClient"
import { GRIST } from "@/infrastructure/grist/constants/gristConstants"
import { GristProduit } from "../mappers/produitMapper"

/**
 * Récupère les outils depuis Grist avec un filtre de mutualisation
 * @param mutualise - true pour les outils mutualisés, false pour les non-mutualisés
 * @returns Promise<Produit[]> - Liste des outils
 */
async function getOutilsByMutualisation(mutualise: boolean): Promise<Produit[]> {
    const gristOutils = await apiClient.get(`/tables/${GRIST.PRODUITS_ET_OUTILS.ID}/records`, {
        params: {
            filter: `{"${GRIST.PRODUITS_ET_OUTILS.FIELDS.TYPE}": ["Outil"], "${GRIST.PRODUITS_ET_OUTILS.FIELDS.MUTUALISE}": [${mutualise}]}`
        }
    })

    return mapGristOutilsToProduits(gristOutils.data.records).sort((a, b) => a.nom.localeCompare(b.nom))
}

/**
 * Mappe les données Grist vers le format Produit
 * @param gristOutils - Liste des outils depuis Grist
 * @returns Produit[] - Liste des produits mappés
 */
function mapGristOutilsToProduits(gristOutils: GristProduit[]): Produit[] {
    return gristOutils.map((gristOutil: GristProduit) => ({
        id: gristOutil.id,
        nom: gristOutil.fields?.[GRIST.PRODUITS_ET_OUTILS.FIELDS.NOM] as string || ''
    }))
}

export async function findAllOutilsMutualises(): Promise<Produit[]> {
    return getOutilsByMutualisation(true)
}

export async function findAllOutilsNonMutualises(): Promise<Produit[]> {
    return getOutilsByMutualisation(false)
}

/**
 * Récupère les mappings Outils x Startups pour une startup spécifique depuis Grist
 * @param startupId - ID de la startup
 * @returns Promise<OutilsStartupsMapping[]> - Liste des mappings
 */
export async function findOutilsStartupsMapping(startupId: number): Promise<OutilsStartupsMapping[]> {

    const gristMappings = await apiClient.get(`/tables/${GRIST.OUTILS_STARTUPS.ID}/records`, {
        params: {
            filter: `{"${GRIST.OUTILS_STARTUPS.FIELDS.STARTUP}": [${startupId}]}`
        }
    })
    
    return gristMappings.data.records.map((gristMapping: GristGetRecord) => 
        mapGristToOutilsStartupsMapping(gristMapping)
    );
}

/**
 * Met à jour un mapping Startup x Outils dans Grist
 * @param mapping - Le mapping à mettre à jour
 * @returns Promise<OutilsStartupsMapping> - Le mapping mis à jour
 */
export async function editOutilsStartupsMapping(mapping: OutilsStartupsMapping): Promise<void> {
    const gristMapping = mapOutilsStartupsMappingToGrist(mapping)
    
    await apiClient.put(`/tables/${GRIST.OUTILS_STARTUPS.ID}/records`, {
        records: [gristMapping]
    })
}

/**
 * Mappe un mapping OutilsStartupsMapping vers le format Grist
 * @param mapping - Le mapping à mapper
 * @returns GristOutilsStartupsMapping - Le mapping au format Grist
 */
function mapOutilsStartupsMappingToGrist(mapping: OutilsStartupsMapping): GristPutRecord {
    const gristMapping: GristPutRecord = {
        require: {
            [GRIST.OUTILS_STARTUPS.FIELDS.STARTUP]: mapping.startupId,
            [GRIST.OUTILS_STARTUPS.FIELDS.OUTIL]: mapping.outilId,
        },
        fields: {
            [GRIST.OUTILS_STARTUPS.FIELDS.USAGE]: mapping.usage
        }
    }

    if (mapping.id) {
        gristMapping.id = mapping.id
    }

    return gristMapping
}

/**
 * Supprime un mapping Outils x Startups dans Grist
 * @param mappingId - ID du mapping à supprimer
 * @returns Promise<void>
 */
export async function deleteOutilsStartupsMapping(mappingId: number): Promise<void> {
    await apiClient.post(`/tables/${GRIST.OUTILS_STARTUPS.ID}/data/delete`, 
        [mappingId]
    )
}

/**
 * Crée un nouvel outil non mutualisé dans Grist et l'associe à une startup
 * @param nomOutil - Nom de l'outil à créer
 * @param startupId - ID de la startup à associer
 * @returns Promise<Produit> - L'outil créé
 */
export async function createOutilNonMutualise(nomOutil: string, startupId: number): Promise<Produit> {
    const gristOutil: GristPostRecord = {
        fields: {
            [GRIST.PRODUITS_ET_OUTILS.FIELDS.TYPE]: "Outil",
            [GRIST.PRODUITS_ET_OUTILS.FIELDS.MUTUALISE]: false,
            [GRIST.PRODUITS_ET_OUTILS.FIELDS.NOM]: nomOutil
        }
    }

    const response = await apiClient.post(`/tables/${GRIST.PRODUITS_ET_OUTILS.ID}/records`, {
        records: [gristOutil]
    })

    // L'API Grist retourne un tableau d'IDs des records créés
    const createdRecordId = response.data.records[0]?.['id'] as unknown as number

    // Créer immédiatement le mapping avec la startup
    const mapping: OutilsStartupsMapping = {
        startupId: startupId,
        outilId: createdRecordId
    }
    
    await editOutilsStartupsMapping(mapping)

    return {
        id: createdRecordId,
        nom: nomOutil
    }
}

/**
 * Mappe un mapping Grist vers le format OutilsStartupsMapping
 * @param gristMapping - Le mapping Grist à mapper
 * @returns OutilsStartupsMapping - Le mapping mappé
 */
function mapGristToOutilsStartupsMapping(gristMapping: GristGetRecord): OutilsStartupsMapping {
    return {
        id: gristMapping.id,
        startupId: gristMapping.fields[GRIST.OUTILS_STARTUPS.FIELDS.STARTUP] as number,
        outilId: gristMapping.fields[GRIST.OUTILS_STARTUPS.FIELDS.OUTIL] as number,
        usage: gristMapping.fields[GRIST.OUTILS_STARTUPS.FIELDS.USAGE] as string
    }
}