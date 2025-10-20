import { Consommation } from '@/domain/types'
import { apiClient } from '@/infrastructure/grist/client/gristApiClient'
import { GRIST } from '@/infrastructure/grist/constants/gristConstants'
import { GristConsommation, mapGristConsommationToConsommation } from '@/infrastructure/grist/mappers/consommationMapper'

export async function findConsommationsByProduitId(produitId: number): Promise<Consommation[]> {
    const gristConsommations = await getGristConsommationsByProduitId(produitId)
    return Promise.all(gristConsommations.map(gristConsommation => mapGristConsommationToConsommation(gristConsommation)))
}

export async function findConsommationsByProduitIdAndDate(
    produitId: number, 
    date: Date
): Promise<Consommation[]> {
    console.log('findConsommationsByProduitIdAndDate', produitId, date)
    const gristConsommations = await getGristConsommationsByProduitIdAndDate(produitId, date)
    return Promise.all(gristConsommations.map(gristConsommation => mapGristConsommationToConsommation(gristConsommation)))
}

export async function findConsommationsDuDernierMois(produitId: number): Promise<Consommation[]> {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    lastMonth.setDate(1);
    
    return findConsommationsByProduitIdAndDate(produitId, lastMonth)
}

async function getGristConsommationsByProduitId(produitId: number): Promise<GristConsommation[]> {
    return (await apiClient.get(`/tables/${GRIST.CONSOMMATIONS.ID}/records`, {
        params: {
            filter: `{"${GRIST.CONSOMMATIONS.FIELDS.PRODUIT_ID}":[${produitId}]}`
        }
    })).data.records ?? []
}

async function getGristConsommationsByProduitIdAndDate(
    produitId: number, 
    date: Date, 
): Promise<GristConsommation[]> {
    const newDate = new Date(date.toISOString().split('T')[0]);

    return (await apiClient.get(`/tables/${GRIST.CONSOMMATIONS.ID}/records`, {
        params: {
            filter: `{"${GRIST.CONSOMMATIONS.FIELDS.PRODUIT_ID}":[${produitId}],"${GRIST.CONSOMMATIONS.FIELDS.DATE}":[${newDate.getTime() / 1000}]}`,
            sort: `-${GRIST.CONSOMMATIONS.FIELDS.COUT}`
        }
    })).data.records ?? []
}
