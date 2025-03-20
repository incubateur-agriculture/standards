import { Collaborateur, Startup } from "@/domain/types";
import { apiClient } from "@/infrastructure/grist/client/gristApiClient";
import { GRIST } from "@/infrastructure/grist/constants/gristConstants";

export async function setStartupMembers(startup: Startup, members: Collaborateur[]) {
    const data = { 
        records: [{
            require: {
                [GRIST.STARTUPS.FIELDS.ID_BETA]: startup.idBeta,
            },
            fields: {
                [GRIST.STARTUPS.FIELDS.MEMBRES]: ["L", ...members.map((member) => member.id)],
            }
        }]
    };

    await apiClient.put(`/tables/${GRIST.STARTUPS.ID}/records`, data);
}

export async function getGristStartups(): Promise<Startup[]> {
    return (await apiClient.get(`/tables/${GRIST.STARTUPS.ID}/records`))
        .data.records.map((gristStartup: any) => ({
            id: gristStartup.id,
            idBeta: gristStartup.fields[GRIST.STARTUPS.FIELDS.ID_BETA],
            nom: gristStartup.fields[GRIST.PRODUITS.FIELDS.NOM]
        })) ?? []
} 