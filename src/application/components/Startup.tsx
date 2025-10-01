import { Startup as StartupType } from '@/domain/types'
import OutilsSelector from './OutilsSelector'

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
                        <h2 className="fr-mb-0">Startup : {startup.nom}</h2>
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

