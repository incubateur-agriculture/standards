import { Categorie, Reponse } from "@/domain/types";
import { apiClient } from "@/infrastructure/grist/client/gristApiClient";
import { GRIST } from "@/infrastructure/grist/constants/gristConstants";

export async function findQuestions(reponses: Record<string, Reponse>, previousReponses: Record<string, Reponse>): Promise<Categorie[]> {
    const gristQuestions = await getGristQuestions();

    return Object.values(gristQuestions.records.reduce((acc: Record<string, Categorie>, gristQuestion: any) => {
        return {
            ...acc,
            [gristQuestion.fields[GRIST.QUESTIONS.FIELDS.CATEGORIE]]: {
                ...acc[gristQuestion.fields[GRIST.QUESTIONS.FIELDS.CATEGORIE]],
                titre: gristQuestion.fields[GRIST.QUESTIONS.FIELDS.CATEGORIE],
                questions: [
                    ... (acc[gristQuestion.fields[GRIST.QUESTIONS.FIELDS.CATEGORIE]] ? acc[gristQuestion.fields[GRIST.QUESTIONS.FIELDS.CATEGORIE]].questions : []),
                    {
                        id: gristQuestion.id,
                        question: gristQuestion.fields[GRIST.QUESTIONS.FIELDS.QUESTION],
                        importance: gristQuestion.fields[GRIST.QUESTIONS.FIELDS.IMPORTANCE],
                        tooltip: gristQuestion.fields[GRIST.QUESTIONS.FIELDS.TOOLTIP],
                        reponse: reponses[gristQuestion.id] ?? null,
                        previousReponse: previousReponses[gristQuestion.id] ?? null
                    }
                ]
            }
        }
    }, {}));
}

async function getGristQuestions() {
    return (await apiClient.get(`/tables/${GRIST.QUESTIONS.ID}/records`, {
        params: {
            sort: 'manualSort',
            filter: `{"${GRIST.QUESTIONS.FIELDS.STATUT}": ["Validée"]}`
        }
    })).data;
} 