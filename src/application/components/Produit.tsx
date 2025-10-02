'use client'

import { Produit as ProduitType } from '@/domain/types'
import { Alert } from '@codegouvfr/react-dsfr/Alert'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { Tag } from '@codegouvfr/react-dsfr/Tag'
import Consommation from './Consommation'
import Recommandations from './Recommandations'

const TagGroup = ({ tags, label }: { tags: string[] | undefined, label: string }) => {
    if (!tags?.length) return null
    
    return (
        <div className="fr-mb-1w">
            <span className="fr-text--sm fr-text--bold fr-mr-1w">{label}:</span>
            {tags.map((tag) => (
                <Tag key={tag} className="fr-mr-1w">{tag}</Tag>
            ))}
        </div>
    )
}

export default function Produit({ 
    produit,
}: Readonly<{ 
    produit: ProduitType | null,
}>) {
    
    if (!produit) {
        return null
    }

    return (
        <div className="fr-mb-3w">
            <div className="fr-grid-row fr-grid-row--gutters fr-mb-1w">
                <div className="fr-col-12">
                    <div className="fr-mb-1w">
                        <h2 className="fr-mb-0">Produit : {produit.nom}</h2>
                        <p className="fr-text--sm fr-mb-1w">{produit.description}</p>
                        <div>
                            {produit.statut && <Tag className="fr-mr-1w">{produit.statut}</Tag>}
                            {produit.typeProjet && <Tag className="fr-mr-1w">{produit.typeProjet}</Tag>}
                            {produit.architecture && <Tag className="fr-mr-1w">{produit.architecture}</Tag>}
                        </div>
                    </div>
                    <div className="fr-btns-group fr-btns-group--sm fr-btns-group--inline fr-mb-1w">
                        {produit.homepage && (
                            <Button
                                priority="secondary"
                                size="small"
                                linkProps={{
                                    href: produit.homepage,
                                    target: '_blank',
                                    rel: 'noopener noreferrer'
                                }}
                            >
                                Site web
                            </Button>
                        )}
                        {produit.repository && (
                            <Button
                                priority="secondary"
                                size="small"
                                linkProps={{
                                    href: produit.repository,
                                    target: '_blank',
                                    rel: 'noopener noreferrer'
                                }}
                            >
                                Code source
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-col-md-4">
                    <TagGroup tags={produit.languages} label="Languages" />
                    <TagGroup tags={produit.dependances} label="Dépendances" />
                </div>
                <div className="fr-col-12 fr-col-md-4">
                    <TagGroup tags={produit.hebergement} label="Hébergement" />
                    <TagGroup tags={produit.frontend} label="Frontend" />
                    <TagGroup tags={produit.backend} label="Backend" />
                </div>
                <div className="fr-col-12 fr-col-md-4">
                    <TagGroup tags={produit.authentification} label="Authentification" />
                </div>
            </div>

            <Consommation produitId={produit.id} />
            <Recommandations produitId={produit.id} />

            <Alert
                severity="info"
                small
                className="fr-mt-2w"
                description="Si vous constatez des erreurs dans ces informations, merci de nous les remonter."
            />
        </div>
    )
} 