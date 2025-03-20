'use server'

import { Categorie, Reponse } from "@/domain/types";
import { getReponses } from "./reponsesRepository";
import { findQuestions } from "@/infrastructure/grist/repositories/questionsGristRepository";
import { getAudit, getPreviousAudit } from "./auditRepository";

export async function getQuestions(produitId: number, auditHash: string|null): Promise<Categorie[]> {

    const audit = await getAudit(auditHash);
    if (!audit) {
        return [];
    }

    const reponses: Record<string, Reponse> = (await getReponses(audit.id)).reduce((acc: Record<string, Reponse>, reponse) => {
        return {
            ...acc,
            [reponse.questionId]: reponse
        }
    }, {});

    let previousReponses: Record<string, Reponse> = {};
    const previousAudit = await getPreviousAudit(produitId, auditHash);
    if (previousAudit) {
        previousReponses = (await getReponses(previousAudit.id)).reduce((acc: Record<string, Reponse>, reponse) => {
            return {
                ...acc,
                [reponse.questionId]: reponse
            }
        }, {});
    }

    return findQuestions(reponses, previousReponses);
}