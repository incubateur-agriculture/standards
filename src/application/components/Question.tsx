'use client'

import { REPONSE_NON } from "@/app/constants";
import { Audit, Question as QuestionType, REPONSE_OPTIONS, Reponse } from "@/domain/types";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { Range } from "@codegouvfr/react-dsfr/Range";
import React, { ChangeEvent } from "react";
import QuestionReadonly from "./QuestionReadonly";
import PreviousResponse from "./PreviousResponse";

interface QuestionProps {
  audit: Audit;
  question: QuestionType;
  onChange: (changes: Reponse) => void;
}

interface QuestionState {
  reponse: REPONSE_OPTIONS | null;
  commentaire: string;
  pourcentage: number;
}

export default function Question({ audit, question, onChange }: Readonly<QuestionProps>) {

    const [state, setState] = React.useState<QuestionState>({
        reponse: question.reponse?.reponse || null,
        commentaire: question.reponse?.commentaire || "",
        pourcentage: question.reponse?.pourcentage || 0
    });

    function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        if (!event.target.name || !event.target.value) {
            return;
        }

        const {name, value} = event.target;

        const changeSet = {
            auditId: audit.id,
            questionId: question.id,
            ...state
        };

        switch (name) {
            case `reponses[${question.id}][reponse]`:
                setState(prev => ({...prev, reponse: value as REPONSE_OPTIONS}));
                changeSet.reponse = value as REPONSE_OPTIONS;
                break;
            case `reponses[${question.id}][commentaire]`:
                setState(prev => ({...prev, commentaire: value}));
                changeSet.commentaire = value ?? null;
                break;
            case `reponses[${question.id}][range]`:
                const newPourcentage = parseInt(value);
                setState(prev => ({...prev, pourcentage: newPourcentage}));
                changeSet.pourcentage = state.reponse === REPONSE_NON ? newPourcentage : 0;
                break;
        }
        
        onChange(changeSet);
    }

    const reset = async () => {
        setState({
            reponse: null,
            commentaire: "",
            pourcentage: 0
        });

        onChange({
            auditId: audit.id,
            questionId: question.id,
            reponse: null,
            commentaire: "",
            pourcentage: 0,
            reset: true
        });
    }

    return (
        <div style={{ padding: 10, marginBottom: 10, borderRadius: 5, ... state.reponse && { border: 'solid 1px #27a658'} }}>
            <div style={{display: 'flex', flexDirection: 'row', marginTop: 20, alignItems: 'stretch', paddingBottom: 20}}>
                <div style={{marginRight: 20, flexBasis: 400, flexGrow: 0.6}}>
                    <RadioButtons
                        disabled={audit.cloture}
                        legend={question.question}
                        hintText={question.tooltip}
                        style={{whiteSpace: 'pre-line'}}
                        orientation="horizontal"
                        options={[
                            {
                                label: "Oui",
                                nativeInputProps: {
                                    checked: state.reponse === REPONSE_OPTIONS.OUI,
                                    name: `reponses[${question.id}][reponse]`,
                                    value: REPONSE_OPTIONS.OUI,
                                    onChange: handleChange
                                }
                            },
                            {
                                label: "Non",
                                nativeInputProps: {
                                    checked: state.reponse === REPONSE_OPTIONS.NON,
                                    name: `reponses[${question.id}][reponse]`,
                                    value: REPONSE_OPTIONS.NON,
                                    onChange: handleChange
                                }
                            },
                            {
                                label: "Je ne sais pas",
                                nativeInputProps: {
                                    checked: state.reponse === REPONSE_OPTIONS.NE_SAIS_PAS,
                                    name: `reponses[${question.id}][reponse]`,
                                    value: REPONSE_OPTIONS.NE_SAIS_PAS,
                                    onChange: handleChange
                                }
                            },
                            {
                                label: "Non applicable",
                                nativeInputProps: {
                                    checked: state.reponse === REPONSE_OPTIONS.NON_APPLICABLE,
                                    name: `reponses[${question.id}][reponse]`,
                                    value: REPONSE_OPTIONS.NON_APPLICABLE,
                                    onChange: handleChange
                                }
                            }
                        ]}
                    />
                    { state.reponse === REPONSE_NON && (
                        <Range
                            disabled={audit.cloture}
                            label=""
                            id={`reponses[${question.id}][range]`}
                            hintText='A quel pourcentage êtes vous du "Oui" ?'
                            max={100}
                            min={0}
                            step={10}
                            nativeInputProps={{
                                value: state.pourcentage,
                                onChange: handleChange,
                            }}
                            small
                        />
                    )}
                </div>
                
                <Input
                    disabled={audit.cloture}
                    label=""
                    style={{display: 'flex', flexGrow: 0.4 }}
                    nativeTextAreaProps={{
                        value: state.commentaire,
                        style: {display: 'flex', flexGrow: 1 },
                        placeholder: "Commentaires / détails",
                        name: `reponses[${question.id}][commentaire]`,
                        onChange: handleChange,
                    }}
                    textArea
                />
            </div>
            { question.previousReponse && (
                <PreviousResponse previousReponse={question.previousReponse} />
            )}
            { state.reponse && (
                <div>
                    <Badge severity="success" style={{marginRight: 10 }}>Répondue</Badge>
                    <Button 
                        title="Reset"
                        priority="tertiary no outline" 
                        iconId="ri-arrow-go-back-line" 
                        onClick={reset}
                    />
                </div>
            )}
        </div>
    );
}