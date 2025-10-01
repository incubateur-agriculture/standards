'use client'

import { REPONSE_OPTIONS } from "@/domain/types"
import type { Audit, Question as QuestionType, Reponse } from "@/domain/types"
import { Badge } from "@codegouvfr/react-dsfr/Badge"
import { Card } from "@codegouvfr/react-dsfr/Card"
import type { AlertProps } from "@codegouvfr/react-dsfr/Alert"
import PreviousResponse from "./PreviousResponse"

export default function QuestionReadonly({ audit, question }: Readonly<{audit: Audit, question: QuestionType }>) {
    const badgeForReponse = (reponse: Reponse | null): any => {
        if (!reponse) {
            return <Badge 
                style={{ fontSize: 20 }} 
                severity="new"
                aria-label="Question non répondue"
            >
                Non répondue
            </Badge>
        }

        const getBadgeConfig = (reponse: Reponse): { severity: AlertProps.Severity | 'new', label: string } => {
            switch (reponse.reponse) {
                case REPONSE_OPTIONS.OUI:
                    return { severity: 'success', label: 'Oui' }
                case REPONSE_OPTIONS.NON: {
                    const displayedPourcentage = reponse.pourcentage && reponse.pourcentage > 0 
                        ? ` (${reponse.pourcentage}%)`
                        : ''
                    return { severity: 'error', label: `Non${displayedPourcentage}` }
                }
                case REPONSE_OPTIONS.NE_SAIS_PAS:
                    return { severity: 'warning', label: 'Ne sais pas' }
                case REPONSE_OPTIONS.NON_APPLICABLE:
                    return { severity: 'info', label: 'Non applicable' }
            }

            return { severity: 'new', label: 'Non répondue' }
        }

        const { severity, label } = getBadgeConfig(reponse)
        return <Badge 
            style={{ fontSize: 20 }} 
            severity={severity}
            aria-label={`Réponse: ${label}`}
        >
            {label}
        </Badge>
    }

    return (
        <div 
            className="p-2.5 mb-2.5 rounded" 
            role="region"
            aria-label={`Question: ${question.question}`}
        >
            <div className="flex flex-row mt-5 items-stretch pb-5">
                <Card
                    className="flex-grow"
                    background
                    border
                    title={question.question}
                    titleAs="h3"
                    desc={question.tooltip}
                    size="small"
                    end={(
                        <div>
                            {badgeForReponse(question.reponse)}
                            {question.reponse?.commentaire && (
                                <p className="whitespace-pre-wrap mt-2.5">{question.reponse?.commentaire}</p>
                            )}
                            { question.previousReponse && (
                                <PreviousResponse previousReponse={question.previousReponse} />
                            )}
                        </div>
                    )}
                />
            </div>
        </div>
    )
}
