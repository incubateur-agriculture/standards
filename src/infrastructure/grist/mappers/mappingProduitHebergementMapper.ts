import { MappingProduitHebergement } from '@/domain/types'
import { GRIST } from '@/infrastructure/grist/constants/gristConstants'

export interface GristMappingProduitHebergement {
    id: number
    fields: {
        [GRIST.MAPPING_PRODUIT_HEBERGEMENT.FIELDS.IDENTIFIANT_OUTIL]: string
    }
}

export const mapGristMappingProduitHebergementToMappingProduitHebergement = (
    gristMapping: GristMappingProduitHebergement
): MappingProduitHebergement => {
    return {
        id: gristMapping.id,
        identifiantOutil: gristMapping.fields[GRIST.MAPPING_PRODUIT_HEBERGEMENT.FIELDS.IDENTIFIANT_OUTIL] as string
    }
}
