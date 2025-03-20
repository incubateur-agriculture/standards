import { Collaborateur } from "@/domain/types";
import { apiClient } from "@/infrastructure/grist/client/gristApiClient";
import { GRIST } from "@/infrastructure/grist/constants/gristConstants";

export async function saveCollaborateurs(collaborateurs: Collaborateur[]): Promise<Collaborateur[]> {
    const data = { 
        records: collaborateurs.map((collaborateur) => ({
            require: {
                [GRIST.COLLABORATEURS.FIELDS.ID_BETA]: collaborateur.idBeta,
            },
            fields: {
                [GRIST.COLLABORATEURS.FIELDS.NOM_COMPLET]: collaborateur.nomComplet,
                [GRIST.COLLABORATEURS.FIELDS.DOMAINE]: collaborateur.domaine,
            }
        }))
    };

    await apiClient.put(`/tables/${GRIST.COLLABORATEURS.ID}/records`, data);
    
    return getCollaborateurs({ [GRIST.COLLABORATEURS.FIELDS.ID_BETA]: collaborateurs.map((c) => c.idBeta) });
}

export async function getCollaborateurs(filters: Record<string, string[]>): Promise<Collaborateur[]> {
    return (await apiClient.get(`/tables/${GRIST.COLLABORATEURS.ID}/records`,
        {
            params: {
                filter: JSON.stringify(filters)
            }
        }
    )).data.records.map((gristCollaborateur: any) => ({
            id: gristCollaborateur.id,
            idBeta: gristCollaborateur.fields[GRIST.COLLABORATEURS.FIELDS.ID_BETA],
            nomComplet: gristCollaborateur.fields[GRIST.COLLABORATEURS.FIELDS.NOM_COMPLET],
            domaine: gristCollaborateur.fields[GRIST.COLLABORATEURS.FIELDS.DOMAINE]
        })) ?? []
} 