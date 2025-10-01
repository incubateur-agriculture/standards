import { Consommation } from '@/domain/types'
import { GRIST } from '@/infrastructure/grist/constants/gristConstants'

export interface GristConsommation {
    id: number
    fields: {
        [GRIST.CONSOMMATIONS.FIELDS.PRODUIT_ID]: number
        [GRIST.CONSOMMATIONS.FIELDS.OUTIL]: string
        [GRIST.CONSOMMATIONS.FIELDS.COUT]: number
        [GRIST.CONSOMMATIONS.FIELDS.DETAIL]: string
        [GRIST.CONSOMMATIONS.FIELDS.DATE]: string
    }
}

export const mapGristConsommationToConsommation = (gristConsommation: GristConsommation): Consommation => {
    return {
        id: gristConsommation.id,
        produitId: gristConsommation.fields[GRIST.CONSOMMATIONS.FIELDS.PRODUIT_ID] as number,
        outil: gristConsommation.fields[GRIST.CONSOMMATIONS.FIELDS.OUTIL] as string,
        cout: gristConsommation.fields[GRIST.CONSOMMATIONS.FIELDS.COUT] as number,
        detail: gristConsommation.fields[GRIST.CONSOMMATIONS.FIELDS.DETAIL] as string,
        date: new Date(gristConsommation.fields[GRIST.CONSOMMATIONS.FIELDS.DATE])
    }
}
