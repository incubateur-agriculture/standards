'use client'

import { Tabs } from "@codegouvfr/react-dsfr/Tabs"
import { Audit as AuditType, Categorie as CategorieType, Reponse } from "@/domain/types"
import Question from "./Question"
import QuestionReadonly from "./QuestionReadonly"
import { saveReponse } from "@/infrastructure/repositories/reponsesRepository"

export default function Audit({ audit, categories }: Readonly<{ audit: AuditType, categories: CategorieType[] }>) {

    const handleQuestionChange = async (reponse: Reponse) => {
        await saveReponse(reponse)
    }

    return (
        <>           
            <Tabs                
                tabs={categories?.map((categorie, index) => ({
                    tabId: index.toString(),
                    label: categorie.titre,
                    content: categorie.titre ? (
                        <div key={`category.${categorie.titre}`} title={categorie.titre}>
                            {categorie.questions.map((question) => (
                                audit.cloture ? (
                                    <QuestionReadonly
                                        audit={audit}
                                        question={question}
                                        key={`question.${question.id}`}
                                    />
                                ) : (
                                    <Question
                                        audit={audit}
                                        question={question}
                                        key={`question.${question.id}`}
                                        onChange={handleQuestionChange}
                                    />
                                )
                            ))}
                        </div>
                    ) : undefined
                }))}
            />
        </>
    )
}