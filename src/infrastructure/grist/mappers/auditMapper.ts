import { Audit } from "@/domain/types";
import { GRIST } from "@/infrastructure/grist/constants/gristConstants";

export function mapGristAuditToAudit(gristAudit: any, gristProduit: any): Audit|null {
    if (!gristAudit || !gristProduit) {
        return null;
    }

    return {
        id: gristAudit.id,
        dateComiteInvestissement: new Date(gristAudit.fields[GRIST.AUDITS.FIELDS.COMITE_INVESTISSEMENT] * 1000),
        cloture: gristAudit.fields[GRIST.AUDITS.FIELDS.CLOTURE],
        clotureLe: new Date(gristAudit.fields[GRIST.AUDITS.FIELDS.CLOTURE_LE] * 1000),
        produit: {
            id: gristProduit.id,
            nom: gristProduit.fields[GRIST.PRODUITS.FIELDS.NOM]
        }
    }
}