'use server'

import { Reponse } from "@/domain/types";
import { findReponseByAuditAndQuestionId, findReponsesByAuditId, saveReponseRecords } from "@/infrastructure/grist/repositories/reponsesGristRepository";

export async function getReponses(auditId: number): Promise<Reponse[]> {
    return findReponsesByAuditId(auditId);
}

export async function getReponse(auditId: number, questionId: number): Promise<Reponse> {
    return findReponseByAuditAndQuestionId(auditId, questionId);
}

export async function saveReponse(reponse: Reponse) {
    await saveReponses([reponse]);
}

export const reponseId = async (reponse: Reponse): Promise<string> => `${reponse.auditId}-${reponse.questionId}`;


export async function saveReponses(reponses: Reponse[]) {
    await saveReponseRecords(reponses);
}