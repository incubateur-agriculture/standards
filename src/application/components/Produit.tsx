'use client'

import { useEffect, useState } from 'react'
import { Produit as ProduitType } from '@/domain/types'
import { Alert } from '@codegouvfr/react-dsfr/Alert'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { Tag } from '@codegouvfr/react-dsfr/Tag'
import OutilsSelector from './OutilsSelector'
import { saveProduit } from '@/infrastructure/repositories/produitRepository'

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
    const [editedProduit, setEditedProduit] = useState<ProduitType | null>(produit)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    
    if (!produit) {
        return null
    }

    // On component update or produit change
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        setEditedProduit(produit)
    }, [produit])

    const handleOutilsMutualisesChange = async (values: string[]) => {
        if (!editedProduit) return
                
        const updatedProduit = {
            ...editedProduit,
            outilsMutualises: values
        }
        
        setEditedProduit(updatedProduit)
        await saveUpdatedProduit(updatedProduit)
    }

    const handleOutilsNonMutualisesChange = async (values: string[]) => {
        if (!editedProduit) return
                
        const updatedProduit = {
            ...editedProduit,
            outilsNonMutualises: values
        }
        
        setEditedProduit(updatedProduit)
        await saveUpdatedProduit(updatedProduit)
    }

    // Fonction pour sauvegarder le produit avec gestion des erreurs
    const saveUpdatedProduit = async (updatedProduit: ProduitType) => {
        if (!updatedProduit || !updatedProduit.id) {
            setError("Impossible de sauvegarder : données du produit invalides");
            return;
        }

        try {
            setSaving(true)
            setError(null)
            
            // S'assurer que les tableaux sont bien définis, même vides
            const produitToSave: ProduitType = {
                ...updatedProduit,
                // S'assurer que tous les tableaux sont bien définis
                outilsMutualises: updatedProduit.outilsMutualises || [],
                outilsNonMutualises: updatedProduit.outilsNonMutualises || [],
                languages: updatedProduit.languages || [],
                dependances: updatedProduit.dependances || [],
                hebergement: updatedProduit.hebergement || [],
                frontend: updatedProduit.frontend || [],
                backend: updatedProduit.backend || [],
                authentification: updatedProduit.authentification || []
            };
            
            // Appel de l'API pour sauvegarder
            await saveProduit(produitToSave)
         
        } catch (err) {
            console.error('Erreur lors de la sauvegarde du produit:', err)
            setError('Une erreur est survenue lors de la sauvegarde des modifications.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fr-mb-3w">
            <div className="fr-grid-row fr-grid-row--gutters fr-mb-1w">
                <div className="fr-col-12">
                    <div className="fr-mb-1w">
                        <h2 className="fr-mb-0">{produit.nom}</h2>
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

            {/* Affichage direct des sélecteurs multiples */}
            <div className="fr-mt-3w">
                <OutilsSelector
                    produit={editedProduit}
                    onOutilsMutualisesChange={handleOutilsMutualisesChange}
                    onOutilsNonMutualisesChange={handleOutilsNonMutualisesChange}
                    disabled={saving} // Désactive les sélecteurs pendant la sauvegarde ou en mode lecture seule
                />
            </div>

            {/* Affichage des erreurs */}
            {error && (
                <Alert
                    severity="error"
                    small
                    className="fr-mt-2w"
                    description={error}
                    closable
                    onClose={() => setError(null)}
                />
            )}

            {/* Indicateur de sauvegarde */}
            {saving && (
                <div className="fr-mt-2w">
                    <p className="fr-text--sm">Sauvegarde en cours...</p>
                </div>
            )}

            <Alert
                severity="info"
                small
                className="fr-mt-2w"
                description="Si vous constatez des erreurs dans ces informations, merci de nous les remonter."
            />
        </div>
    )
} 