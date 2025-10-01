import { Startup } from "@/domain/types"
import { apiClient } from "@/infrastructure/grist/client/gristApiClient"
import { GRIST } from "@/infrastructure/grist/constants/gristConstants"
import { GristStartup, mapGristStartupToStartup } from "@/infrastructure/grist/mappers/startupMapper"

export async function findStartupById(startupId: number): Promise<Startup|null> {
    const gristStartup = await getGristStartup(startupId)

    if (!gristStartup) {
        return null
    }
    return mapGristStartupToStartup(gristStartup)
}

export async function findAllStartups(): Promise<Startup[]> {
    const gristStartups = await getGristStartups()
    return gristStartups.map(gristStartup => mapGristStartupToStartup(gristStartup))
}

export async function findStartupsByIncubateur(incubateur: string): Promise<Startup[]> {
    const gristStartups = await getGristStartupsByIncubateur(incubateur)
    return gristStartups.map(gristStartup => mapGristStartupToStartup(gristStartup))
}

export async function findActiveStartups(): Promise<Startup[]> {
    const gristStartups = await getGristActiveStartups()
    return gristStartups.map(gristStartup => mapGristStartupToStartup(gristStartup))
}

export async function getGristStartup(startupId: number) {
    return (await apiClient.get(`/tables/${GRIST.STARTUPS.ID}/records`, {
        params: {
            filter: `{"id":[${startupId}]}`
        }
    })).data.records[0] ?? null
} 

async function getGristStartups(): Promise<GristStartup[]> {
    return (await apiClient.get(`/tables/${GRIST.STARTUPS.ID}/records`))
        .data.records ?? []
} 

async function getGristStartupsByIncubateur(incubateur: string): Promise<GristStartup[]> {
    return (await apiClient.get(`/tables/${GRIST.STARTUPS.ID}/records`, {
        params: {
            filter: `{"${GRIST.STARTUPS.FIELDS.INCUBATEUR}":["${incubateur}"]}`
        }
    })).data.records ?? []
}

async function getGristActiveStartups(): Promise<GristStartup[]> {
    return (await apiClient.get(`/tables/${GRIST.STARTUPS.ID}/records`, {
        params: {
            filter: `{"${GRIST.STARTUPS.FIELDS.ACTIF}":[true]}`
        }
    })).data.records ?? []
}

/**
 * Sauvegarde une startup dans Grist
 * @param startup La startup à sauvegarder
 * @returns Promise<void>
 */
export async function saveStartup(startup: Startup): Promise<void> {
    // Vérification
    if (!startup || !startup.id) {
        throw new Error("Startup invalide ou ID manquant");
    }

    // Structure de la requête pour Grist
    const gristRecord = {
        records: [
            {
                id: startup.id,
                fields: {
                    [GRIST.STARTUPS.FIELDS.NOM]: startup.nom || "",
                    [GRIST.STARTUPS.FIELDS.ACRONYME]: startup.acronyme || "",
                    [GRIST.STARTUPS.FIELDS.INTRA]: startup.intra || "",
                    [GRIST.STARTUPS.FIELDS.ACTIF]: startup.actif ?? true,
                    [GRIST.STARTUPS.FIELDS.INCUBATEUR]: startup.incubateur || "",
                    [GRIST.STARTUPS.FIELDS.STATUT]: startup.statut || null,
                    [GRIST.STARTUPS.FIELDS.TYPOLOGIE_PRODUIT]: startup.typologieProduit || null,
                    [GRIST.STARTUPS.FIELDS.BASE_RH]: startup.baseRh || null,
                    [GRIST.STARTUPS.FIELDS.ID_CANAL_MATTERMOST]: startup.idCanalMattermost || null,
                    [GRIST.STARTUPS.FIELDS.OUTILS_STARTUPS]: Array.isArray(startup.outilsStartups) ? ['L', ...startup.outilsStartups] : []
                }
            }
        ]
    };

    try {
        const response = await apiClient.patch(`/tables/${GRIST.STARTUPS.ID}/records`, gristRecord);
        
        if (response.status !== 200) {
            console.error("Error saving startup:", response.data);
            throw new Error(`Error saving startup: ${response.status}`);
        }
        
        return;
    } catch (error) {
        console.error("Exception when saving startup:", error);
        throw error;
    }
}
