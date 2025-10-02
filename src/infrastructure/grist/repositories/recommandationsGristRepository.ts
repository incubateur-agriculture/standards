import { Recommandation } from '@/domain/types'
import { apiClient } from '@/infrastructure/grist/client/gristApiClient'
import { GRIST } from '@/infrastructure/grist/constants/gristConstants'
import { GristRecommandation, mapGristRecommandationToRecommandation } from '@/infrastructure/grist/mappers/recommandationMapper'

export async function findRecommandationsByProduitId(produitId: number): Promise<Recommandation[]> {
    const gristRecommandations = await getGristRecommandationsByProduitId(produitId)
    return gristRecommandations.map(gristRecommandation => mapGristRecommandationToRecommandation(gristRecommandation))
}

export async function findRecommandationsByProduitIdAndStatut(
    produitId: number, 
    statut: string
): Promise<Recommandation[]> {
    const gristRecommandations = await getGristRecommandationsByProduitIdAndStatut(produitId, statut)
    return gristRecommandations.map(gristRecommandation => mapGristRecommandationToRecommandation(gristRecommandation))
}

export async function findRecommandationsNonFaitesByProduitId(produitId: number): Promise<Recommandation[]> {
    const gristRecommandations = await getGristRecommandationsNonFaitesByProduitId(produitId)
    return gristRecommandations.map(gristRecommandation => mapGristRecommandationToRecommandation(gristRecommandation))
}

export async function updateRecommandationStatut(recommandationId: number, nouveauStatut: string): Promise<void> {
    await apiClient.patch(`/tables/${GRIST.RECOMMANDATIONS.ID}/records`, {
        records: [{
            id: recommandationId,
            fields: {
                [GRIST.RECOMMANDATIONS.FIELDS.STATUT]: nouveauStatut,
            }
        }]
    })
}

async function getGristRecommandationsByProduitId(produitId: number): Promise<GristRecommandation[]> {
    return (await apiClient.get(`/tables/${GRIST.RECOMMANDATIONS.ID}/records`, {
        params: {
            filter: `{"${GRIST.RECOMMANDATIONS.FIELDS.PRODUIT_ID}":[${produitId}]}`,
            sort: `-${GRIST.RECOMMANDATIONS.FIELDS.PRIORITE}`
        }
    })).data.records ?? []
}

async function getGristRecommandationsByProduitIdAndStatut(
    produitId: number, 
    statut: string
): Promise<GristRecommandation[]> {
    return (await apiClient.get(`/tables/${GRIST.RECOMMANDATIONS.ID}/records`, {
        params: {
            filter: `{"${GRIST.RECOMMANDATIONS.FIELDS.PRODUIT_ID}":[${produitId}],"${GRIST.RECOMMANDATIONS.FIELDS.STATUT}":"${statut}"}`,
            sort: `-${GRIST.RECOMMANDATIONS.FIELDS.PRIORITE}`
        }
    })).data.records ?? []
}

async function getGristRecommandationsNonFaitesByProduitId(produitId: number): Promise<GristRecommandation[]> {
    return (await apiClient.get(`/tables/${GRIST.RECOMMANDATIONS.ID}/records`, {
        params: {
            filter: `{"${GRIST.RECOMMANDATIONS.FIELDS.PRODUIT_ID}":[${produitId}]}`,
            sort: `-${GRIST.RECOMMANDATIONS.FIELDS.PRIORITE}`
        }
    })).data.records.filter((recommandation: GristRecommandation) => recommandation.fields[GRIST.RECOMMANDATIONS.FIELDS.STATUT] !== 'Fait') ?? []
}
