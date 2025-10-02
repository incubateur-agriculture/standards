import { Reponse } from "@/domain/types";
import { apiClient } from "@/infrastructure/grist/client/gristApiClient";
import { GRIST } from "@/infrastructure/grist/constants/gristConstants";
import { mapGristReponseToReponse } from "@/infrastructure/grist/mappers/reponseMapper";

export async function findReponsesByAuditId(auditId: number): Promise<Reponse[]> {
    const gristReponses = await getGristReponses(auditId);
    return gristReponses.map(mapGristReponseToReponse);
}

export async function findReponseByAuditAndQuestionId(auditId: number, questionId: number): Promise<Reponse> {
    const gristReponse = await getGristReponse(auditId, questionId);
    return mapGristReponseToReponse(gristReponse);
}

export async function saveReponseRecords(reponses: Reponse[]): Promise<void> {
    await saveGristReponses(reponses.map((reponse) => ({
        require: {
            [GRIST.REPONSES.FIELDS.AUDIT]: reponse.auditId,
            [GRIST.REPONSES.FIELDS.QUESTION]: reponse.questionId,
        },
        fields: {
            ... ((reponse.reponse != null || reponse.reset) && {
                [GRIST.REPONSES.FIELDS.REPONSE]: reponse.reponse,
            }),
            ... ((reponse.commentaire != null || reponse.reset || reponse.commentaireModified) && {
                [GRIST.REPONSES.FIELDS.COMMENTAIRES]: reponse.commentaire,
            }),
            [GRIST.REPONSES.FIELDS.POURCENTAGE]: reponse.pourcentage,
        }
    })));
}

async function getGristReponses(auditId: number) {
    return (await apiClient.get(`/tables/${GRIST.REPONSES.ID}/records`, {
        params: {
            filter: `{"${GRIST.REPONSES.FIELDS.AUDIT}": [${auditId}]}`
        }
    })).data?.records ?? [];
}

async function getGristReponse(auditId: number, questionId: number) {
    return (await apiClient.get(`/tables/${GRIST.REPONSES.ID}/records`, {
        params: {
            filter: `{"${GRIST.REPONSES.FIELDS.AUDIT}": [${auditId}], "${GRIST.REPONSES.FIELDS.QUESTION}": [${questionId}]}`
        }
    })).data?.records[0] ?? null;
}

async function saveGristReponses(records: any) {
    await apiClient.put(`/tables/${GRIST.REPONSES.ID}/records`, { 
        records 
    });
} 