import { Startup } from "@/domain/types"
import { GRIST } from "@/infrastructure/grist/constants/gristConstants"

const cleanGristArray = (array: string[] | undefined): string[] => {
    if (!array) return []
    return array[0] === 'L' ? array.slice(1) : array
}

export interface GristStartup {
    id: number
    fields: Record<string, string | string[] | boolean | undefined>
}

export function mapGristStartupToStartup(gristStartup: GristStartup): Startup {

    return {
        id: gristStartup.id,
        nom: gristStartup.fields[GRIST.STARTUPS.FIELDS.NOM] as string,
        acronyme: gristStartup.fields[GRIST.STARTUPS.FIELDS.ACRONYME] as string,
        intra: gristStartup.fields[GRIST.STARTUPS.FIELDS.INTRA] as string,
        actif: gristStartup.fields[GRIST.STARTUPS.FIELDS.ACTIF] as boolean,
        incubateur: gristStartup.fields[GRIST.STARTUPS.FIELDS.INCUBATEUR] as string,
        statut: gristStartup.fields[GRIST.STARTUPS.FIELDS.STATUT] as string,
        typologieProduit: gristStartup.fields[GRIST.STARTUPS.FIELDS.TYPOLOGIE_PRODUIT] as string,
        baseRh: gristStartup.fields[GRIST.STARTUPS.FIELDS.BASE_RH] as string,
        idCanalMattermost: gristStartup.fields[GRIST.STARTUPS.FIELDS.ID_CANAL_MATTERMOST] as string,
        outilsStartups: cleanGristArray(gristStartup.fields[GRIST.STARTUPS.FIELDS.OUTILS_STARTUPS] as string[])
    }
}
