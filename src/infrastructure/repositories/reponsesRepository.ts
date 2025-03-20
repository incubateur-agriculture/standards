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
    await naiveSaveWithPacking(reponse);
}

export const reponseId = async (reponse: Reponse): Promise<string> => `${reponse.auditId}-${reponse.questionId}`;

let isPacking: boolean;
let packedReponses: Record<string, Reponse>;
let currentTimerId: NodeJS.Timeout;

async function naiveSaveWithPacking(reponse?: Reponse) {
    if (!isPacking) {
        packedReponses= {};
        isPacking = true;
        currentTimerId = setTimeout(naiveSaveWithPacking, 1000);
    } else {
        const countReponses = Object.keys(packedReponses).length;
        if (!reponse || countReponses > 40) {
            if (countReponses > 0) {
                await saveReponses(Object.values(packedReponses));
            }
            isPacking = false;
            clearTimeout(currentTimerId);
        }    
    }

    if (reponse) {
        const rId = await reponseId(reponse);
        if (!packedReponses[rId]?.reset) {
            packedReponses = {
                ...packedReponses,
                [rId]: reponse
            }
        }
    } 
}

export async function saveReponses(reponses: Reponse[]) {
    await saveReponseRecords(reponses);
}