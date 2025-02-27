import axios from "axios";

import { GRIST } from "../app/constants";
import { Collaborateur, Startup } from "@/domain/types";

const { GRIST_URL, GRIST_API_KEY, GRIST_DOC_ID } = process.env;

const apiClient = axios.create({
    baseURL: GRIST_URL,
    headers: { Authorization: `Bearer ${GRIST_API_KEY}`},
});

export async function getGristQuestions() {
    return (await apiClient.get(`/docs/${GRIST_DOC_ID}/tables/${GRIST.TABLES.QUESTIONS.ID}/records`, {
        params: {
            sort: 'manualSort',
            filter: '{"Statut": ["Validée"]}'
        }
    })).data;
}

export async function getGristReponses(auditId: number) {
    return (await apiClient.get(`/docs/${GRIST_DOC_ID}/tables/${GRIST.TABLES.REPONSES.ID}/records`, {
        params: {
            filter: `{"Audit": [${auditId}]}`
        }
    })).data?.records ?? [];
}

export async function getGristReponse(auditId: number, questionId: number) {
    return (await apiClient.get(`/docs/${GRIST_DOC_ID}/tables/${GRIST.TABLES.REPONSES.ID}/records`, {
        params: {
            filter: `{"Audit": [${auditId}], "Question": [${questionId}]}`
        }
    })).data?.records[0] ?? null;
}

export async function saveGristReponses(records: any) {
    await apiClient.put(`/docs/${GRIST_DOC_ID}/tables/${GRIST.TABLES.REPONSES.ID}/records`, { 
        records 
    });
}

export async function getGristAudit(auditHash: string) {
    return (await apiClient.get(`/docs/${GRIST_DOC_ID}/tables/${GRIST.TABLES.AUDITS.ID}/records`, {
        params: {
            filter: `{"${GRIST.TABLES.AUDITS.FIELDS.HASH}":["${auditHash}"]}`
        }
    })).data.records[0] ?? null
}

export async function getGristProduit(produitId: number) {
    return (await apiClient.get(`/docs/${GRIST_DOC_ID}/tables/${GRIST.TABLES.PRODUITS.ID}/records`, {
        params: {
            filter: `{"${GRIST.TABLES.AUDITS.FIELDS.ID}":["${produitId}"]}`
        }
    })).data.records[0] ?? null
}

export async function setStartupMembers(startup: Startup, members: Collaborateur[]) {
    const data = { 
        records: [{
            require: {
                "Id_Beta": startup.idBeta,
            },
            fields: {
                "Membres": ["L", ...members.map((member) => member.id)],
            }
        }]
    };

    await apiClient.put(`/docs/${GRIST_DOC_ID}/tables/${GRIST.TABLES.STARTUPS.ID}/records`, data);
}
export async function getGristStartups(): Promise<Startup[]> {
    return (await apiClient.get(`/docs/${GRIST_DOC_ID}/tables/${GRIST.TABLES.STARTUPS.ID}/records`))
        .data.records.map((gristStartup: any) => ({
            id: gristStartup.id,
            idBeta: gristStartup.fields.Id_Beta,
            nom: gristStartup.fields.Nom
        })) ?? []
}


export async function saveCollaborateurs(collaborateurs: Collaborateur[]): Promise<Collaborateur[]> {
    const data = { 
        records: collaborateurs.map((collaborateur) => ({
            require: {
                "idBeta": collaborateur.idBeta,
            },
            fields: {
                "Nom_complet": collaborateur.nomComplet,
                "Domaine": collaborateur.domaine,
            }
        }))
    };

    await apiClient.put(`/docs/${GRIST_DOC_ID}/tables/${GRIST.TABLES.COLLABORATEURS.ID}/records`, data);
    
    return getCollaborateurs({ "idBeta": collaborateurs.map((c) => c.idBeta) });
}

export async function getCollaborateurs(filters: Record<string, string[]>): Promise<Collaborateur[]> {
    return (await apiClient.get(`/docs/${GRIST_DOC_ID}/tables/${GRIST.TABLES.COLLABORATEURS.ID}/records`,
        {
            params: {
                filter: JSON.stringify(filters)
            }
        }
    )).data.records.map((gristCollaborateur: any) => ({
            id: gristCollaborateur.id,
            idBeta: gristCollaborateur.fields.idBeta,
            nomComplet: gristCollaborateur.fields.Nom_complet,
            domaine: gristCollaborateur.fields.Domaine
        })) ?? []
}
