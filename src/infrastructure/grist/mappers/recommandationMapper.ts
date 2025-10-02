import { Recommandation } from '@/domain/types'
import { GRIST } from '@/infrastructure/grist/constants/gristConstants'

export interface GristRecommandation {
    id: number
    fields: {
        [GRIST.RECOMMANDATIONS.FIELDS.PRODUIT_ID]: number
        [GRIST.RECOMMANDATIONS.FIELDS.RECOMMANDATION]: string
        [GRIST.RECOMMANDATIONS.FIELDS.STATUT]: string
        [GRIST.RECOMMANDATIONS.FIELDS.PRIORITE]?: string
        [GRIST.RECOMMANDATIONS.FIELDS.COMITE_INVESTISSEMENT]: string
    }
}

export const mapGristRecommandationToRecommandation = (gristRecommandation: GristRecommandation): Recommandation => {
    return {
        id: gristRecommandation.id,
        produitId: gristRecommandation.fields[GRIST.RECOMMANDATIONS.FIELDS.PRODUIT_ID] as number,
        recommandation: gristRecommandation.fields[GRIST.RECOMMANDATIONS.FIELDS.RECOMMANDATION] as string,
        statut: gristRecommandation.fields[GRIST.RECOMMANDATIONS.FIELDS.STATUT] as string,
        priorite: gristRecommandation.fields[GRIST.RECOMMANDATIONS.FIELDS.PRIORITE] as string | undefined,
        comiteInvestissement: gristRecommandation.fields[GRIST.RECOMMANDATIONS.FIELDS.COMITE_INVESTISSEMENT] as string,
    }
}
