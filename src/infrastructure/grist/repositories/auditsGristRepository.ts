import { Audit } from "@/domain/types";
import { apiClient } from "@/infrastructure/grist/client/gristApiClient";
import { GRIST } from "@/infrastructure/grist/constants/gristConstants";
import { mapGristAuditToAudit } from "@/infrastructure/grist/mappers/auditMapper";
import { getGristProduit } from "@/infrastructure/grist/repositories/produitsGristRepository";

export async function findAuditByHash(auditHash: string): Promise<Audit|null> {
    const gristAudit = await getGristAudit(auditHash);
    if (!gristAudit) {
        return null;
    }
    const gristProduit = await getGristProduit(gristAudit.fields[GRIST.AUDITS.FIELDS.PRODUIT]);

    return mapGristAuditToAudit(gristAudit, gristProduit);
}

export async function findPreviousAuditByHash(produitId: number, auditHash: string): Promise<Audit|null> {
    const previousGristAudit = await getPreviousGristAudit(produitId, auditHash);
    if (!previousGristAudit) {
        return null;
    }
    const gristProduit = await getGristProduit(previousGristAudit.fields[GRIST.AUDITS.FIELDS.PRODUIT]);
    return mapGristAuditToAudit(previousGristAudit, gristProduit);
}

async function getGristAudit(auditHash: string) {
    return (await apiClient.get(`/tables/${GRIST.AUDITS.ID}/records`, {
        params: {
            filter: `{"${GRIST.AUDITS.FIELDS.HASH}":["${auditHash}"]}`
        }
    })).data.records[0] ?? null
}

async function getPreviousGristAudit(produitId: number, auditHash: string) {
    const response = await apiClient.get(`/tables/${GRIST.AUDITS.ID}/records`, {
        params: {
            filter: `{"${GRIST.AUDITS.FIELDS.PRODUIT}":[${produitId}]}`,
            sort: `${GRIST.AUDITS.FIELDS.CLOTURE_LE}`
        }
    });

    const audits = response.data.records;
    const currentAuditIndex = audits.findIndex((audit: any) => audit.fields[GRIST.AUDITS.FIELDS.HASH] === auditHash);

    if (currentAuditIndex === -1 || currentAuditIndex === 0) {
        return null;
    }

    return audits[currentAuditIndex - 1] ?? null;
}