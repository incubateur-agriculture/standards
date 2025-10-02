import { Consommation } from '@/domain/types'
import { GRIST } from '@/infrastructure/grist/constants/gristConstants'
import { getIdentifiantOutilById } from '@/infrastructure/grist/repositories/mappingProduitHebergementGristRepository'

export interface GristConsommation {
    id: number
    fields: {
        [GRIST.CONSOMMATIONS.FIELDS.PRODUIT_ID]: number
        [GRIST.CONSOMMATIONS.FIELDS.OUTIL]: string
        [GRIST.CONSOMMATIONS.FIELDS.IDENTIFIANT]: number
        [GRIST.CONSOMMATIONS.FIELDS.COUT]: number
        [GRIST.CONSOMMATIONS.FIELDS.DETAIL]: string
        [GRIST.CONSOMMATIONS.FIELDS.DATE]: string
    }
}

export const mapGristConsommationToConsommation = async (gristConsommation: GristConsommation): Promise<Consommation> => {
    // Récupérer l'identifiant de l'outil depuis la table Mapping_Produit_Hebergement
    const identifiantOutilId = gristConsommation.fields[GRIST.CONSOMMATIONS.FIELDS.IDENTIFIANT] as number
    const identifiantOutil = await getIdentifiantOutilById(identifiantOutilId)

    return {
        id: gristConsommation.id,
        produitId: gristConsommation.fields[GRIST.CONSOMMATIONS.FIELDS.PRODUIT_ID] as number,
        outil: gristConsommation.fields[GRIST.CONSOMMATIONS.FIELDS.OUTIL] as string,
        identifiant: identifiantOutil || '',
        cout: gristConsommation.fields[GRIST.CONSOMMATIONS.FIELDS.COUT] as number,
        detail: gristConsommation.fields[GRIST.CONSOMMATIONS.FIELDS.DETAIL] as string,
        date: new Date(gristConsommation.fields[GRIST.CONSOMMATIONS.FIELDS.DATE])
    }
}
