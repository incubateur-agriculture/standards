import { Reponse } from "@/domain/types";
import { GRIST } from "@/infrastructure/grist/constants/gristConstants";

export function mapGristReponseToReponse(gristReponse: any): Reponse {
    return {
        id: gristReponse.id,
        auditId: gristReponse.fields[GRIST.REPONSES.FIELDS.AUDIT],
        questionId: gristReponse.fields[GRIST.REPONSES.FIELDS.QUESTION],
        reponse: gristReponse.fields[GRIST.REPONSES.FIELDS.REPONSE],
        commentaire: gristReponse.fields[GRIST.REPONSES.FIELDS.COMMENTAIRES],
        pourcentage: gristReponse.fields[GRIST.REPONSES.FIELDS.POURCENTAGE],
    };
} 