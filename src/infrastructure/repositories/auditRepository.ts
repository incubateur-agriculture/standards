'use server'

import { Audit } from "@/domain/types";
import { findAuditByHash, findPreviousAuditByHash } from "@/infrastructure/grist/repositories/auditsGristRepository";

export async function getAudit(auditHash: string|null): Promise<Audit|null> {
    if (!auditHash) {
        return null;
    }

    return findAuditByHash(auditHash);
}

export async function getPreviousAudit(produitId: number, auditHash: string|null): Promise<Audit|null> {
    if (!auditHash) {
        return null;
    }

    return findPreviousAuditByHash(produitId, auditHash);
}