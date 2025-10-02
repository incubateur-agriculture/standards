import { MappingProduitHebergement } from '@/domain/types'
import { 
    getAllMappingProduitHebergement as getAllMappingProduitHebergementGrist,
    getMappingProduitHebergementById as getMappingProduitHebergementByIdGrist,
    getIdentifiantOutilById as getIdentifiantOutilByIdGrist,
    clearMappingCache as clearMappingCacheGrist
} from '@/infrastructure/grist/repositories/mappingProduitHebergementGristRepository'

export async function getAllMappingProduitHebergement(): Promise<MappingProduitHebergement[]> {
    return getAllMappingProduitHebergementGrist()
}

export async function getMappingProduitHebergementById(id: number): Promise<MappingProduitHebergement | null> {
    return getMappingProduitHebergementByIdGrist(id)
}

export async function getIdentifiantOutilById(id: number): Promise<string | null> {
    return getIdentifiantOutilByIdGrist(id)
}

export function clearMappingCache(): void {
    clearMappingCacheGrist()
}
