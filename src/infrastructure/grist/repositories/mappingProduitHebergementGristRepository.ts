import { apiClient } from '@/infrastructure/grist/client/gristApiClient'
import { GRIST } from '@/infrastructure/grist/constants/gristConstants'
import { MappingProduitHebergement } from '@/domain/types'
import { 
    GristMappingProduitHebergement, 
    mapGristMappingProduitHebergementToMappingProduitHebergement
} from '@/infrastructure/grist/mappers/mappingProduitHebergementMapper'
import { mappingCache, fullMappingCache } from '@/infrastructure/grist/utils/cache'

export async function getAllMappingProduitHebergement(): Promise<MappingProduitHebergement[]> {
    // Vérifier si on a déjà toutes les données en cache
    const cachedValues = fullMappingCache.getValidValues()
    if (cachedValues.length > 0) {
        return cachedValues
    }

    // Sinon, récupérer depuis l'API et mettre en cache
    const gristMappings = await getGristMappingProduitHebergement()
    const mappings = gristMappings.map(gristMapping => mapGristMappingProduitHebergementToMappingProduitHebergement(gristMapping))
    
    // Mettre en cache tous les mappings
    mappings.forEach(mapping => {
        fullMappingCache.set(mapping.id, mapping)
    })

    return mappings
}

export async function getMappingProduitHebergementById(id: number): Promise<MappingProduitHebergement | null> {
    // Vérifier d'abord dans le cache
    const cached = fullMappingCache.get(id)
    if (cached) {
        return cached
    }

    // Sinon, récupérer toutes les données (qui les mettront en cache)
    const mappings = await getAllMappingProduitHebergement()
    return mappings.find(mapping => mapping.id === id) || null
}

export async function getIdentifiantOutilById(id: number): Promise<string | null> {
    // Vérifier d'abord dans le cache des identifiants
    const cachedIdentifiant = mappingCache.get(id)
    if (cachedIdentifiant) {
        return cachedIdentifiant
    }

    // Vérifier dans le cache complet
    const cachedMapping = fullMappingCache.get(id)
    if (cachedMapping) {
        // Mettre en cache l'identifiant pour les prochaines fois
        mappingCache.set(id, cachedMapping.identifiantOutil)
        return cachedMapping.identifiantOutil
    }

    // Sinon, récupérer toutes les données (qui les mettront en cache)
    const mappings = await getAllMappingProduitHebergement()
    const mapping = mappings.find(m => m.id === id)
    
    if (mapping) {
        // Mettre en cache l'identifiant
        mappingCache.set(id, mapping.identifiantOutil)
        return mapping.identifiantOutil
    }

    return null
}

export function clearMappingCache(): void {
    mappingCache.clear()
    fullMappingCache.clear()
}

export function getCacheStats(): { mappingCacheSize: number; fullMappingCacheSize: number } {
    return {
        mappingCacheSize: mappingCache.size(),
        fullMappingCacheSize: fullMappingCache.size()
    }
}

async function getGristMappingProduitHebergement(): Promise<GristMappingProduitHebergement[]> {
    return (await apiClient.get(`/tables/${GRIST.MAPPING_PRODUIT_HEBERGEMENT.ID}/records`)).data.records ?? []
}
