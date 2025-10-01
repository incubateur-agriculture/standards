import { Startup as StartupType } from '@/domain/types'
import { Alert } from '@codegouvfr/react-dsfr/Alert'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { Tag } from '@codegouvfr/react-dsfr/Tag'
import OutilsSelector from './OutilsSelector'

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

const InfoField = ({ label, value }: { label: string, value: string | undefined }) => {
    if (!value) return null
    
    return (
        <div className="fr-mb-1w">
            <span className="fr-text--sm fr-text--bold fr-mr-1w">{label}:</span>
            <span className="fr-text--sm">{value}</span>
        </div>
    )
}

export default function Startup({ 
    startup,
}: Readonly<{ 
    startup: StartupType | null,
}>) {
    if (!startup) {
        return null
    }

    return (
        <div className="fr-mb-3w">
            <div className="fr-grid-row fr-grid-row--gutters fr-mb-1w">
                <div className="fr-col-12">
                    <div className="fr-mb-1w">
                        <h2 className="fr-mb-0">{startup.nom}</h2>
                    </div>
                    <div className="fr-btns-group fr-btns-group--sm fr-btns-group--inline fr-mb-1w">
                        {startup.idCanalMattermost && (
                            <Button
                                priority="secondary"
                                size="small"
                                linkProps={{
                                    href: `https://mattermost.incubateur.anct.gouv.fr/channels/${startup.idCanalMattermost}`,
                                    target: '_blank',
                                    rel: 'noopener noreferrer'
                                }}
                            >
                                Canal Mattermost
                            </Button>
                        )}
                    </div>
                </div>
            </div>


            {/* Affichage direct des sélecteurs multiples */}
            {startup.id && (
                <div className="fr-mt-3w">
                    <OutilsSelector
                        startupId={startup.id}
                    />
                </div>
            )}
        </div>
    )
}

