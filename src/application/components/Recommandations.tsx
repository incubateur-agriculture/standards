'use client'

import { Recommandation } from '@/domain/types'
import { getRecommandationsNonFaitesByProduitId, updateRecommandationStatut } from '@/infrastructure/repositories/recommandationsRepository'
import { Accordion } from '@codegouvfr/react-dsfr/Accordion'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { Select } from '@codegouvfr/react-dsfr/Select'
import { useEffect, useState } from 'react'

interface RecommandationsProps {
  produitId: number
}

const STATUTS_DISPONIBLES = [
  { value: '', label: '' },
  { value: 'En cours', label: 'En cours' },
  { value: 'Fait', label: 'Fait' },
  { value: 'Annulé', label: 'Annulé' }
]

export default function Recommandations({ produitId }: RecommandationsProps) {
  const [recommandations, setRecommandations] = useState<Recommandation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState<number | null>(null)
  const [expanded, setExpanded] = useState(true)

  useEffect(() => {
    const fetchRecommandations = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await getRecommandationsNonFaitesByProduitId(produitId)
        setRecommandations(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      } finally {
        setLoading(false)
      }
    }

    if (produitId) {
      fetchRecommandations()
    }
  }, [produitId])

  const handleStatutChange = async (recommandationId: number, nouveauStatut: string) => {
    try {
      setUpdating(recommandationId)
      await updateRecommandationStatut(recommandationId, nouveauStatut)
      
      // Mettre à jour l'état local
      setRecommandations(prev => 
        prev.map(rec => 
          rec.id === recommandationId 
            ? { ...rec, statut: nouveauStatut }
            : rec
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour')
    } finally {
      setUpdating(null)
    }
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'En attente':
        return 'fr-badge--yellow-tournesol'
      case 'En cours':
        return 'fr-badge--blue-cumulus'
      case 'Fait':
        return 'fr-badge--green-emeraude'
      case 'Annulé':
        return 'fr-badge--red-marianne'
      default:
        return 'fr-badge--grey'
    }
  }

  if (loading) {
    return (
      <div className="fr-mb-3w">
        <Accordion label="Recommandations">
          <div className="fr-text--sm">Chargement des recommandations...</div>
        </Accordion>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fr-mb-3w">
        <Accordion label="Recommandations">
          <div className="fr-text--sm fr-text--error">
            {error}
          </div>
        </Accordion>
      </div>
    )
  }

  if (!recommandations || recommandations.length === 0) {
    return (
      <div className="fr-mb-3w">
        <Accordion label="Recommandations">
          <div className="fr-text--sm">
            Aucune recommandation en attente pour ce produit.
          </div>
        </Accordion>
      </div>
    )
  }

  return (
    <div className="fr-mb-3w">
      <Accordion label={`Recommandations en cours (${recommandations.length})`} expanded={expanded} onExpandedChange={setExpanded}>
        <div className="fr-table">
          <table className="fr-table">
            <thead>
              <tr>
                <th scope="col">Comité</th>
                <th scope="col">Priorité</th>
                <th scope="col">Statut</th>
                <th scope="col">Recommandation</th>
                <th scope="col">Changer statut</th>
              </tr>
            </thead>
            <tbody>
              {recommandations.map((recommandation) => (
                <tr key={recommandation.id}>
                  <td>
                    <span className="fr-text--xs fr-text--alt">
                      {recommandation.comiteInvestissement}
                    </span>
                  </td>
                  <td>
                    {recommandation.priorite ? (
                      <span className={`fr-badge fr-badge--sm fr-badge--purple-glycine`}>
                        {recommandation.priorite}
                      </span>
                    ) : (
                      <span className="fr-text--xs fr-text--alt">-</span>
                    )}
                  </td>
                  <td>
                    {recommandation.statut ? (
                    <span className={`fr-badge fr-badge--sm ${getStatutColor(recommandation.statut)}`}>
                      {recommandation.statut}
                    </span>
                    ) : (
                        <span className="fr-text--xs fr-text--alt">-</span>
                    )}
                  </td>
                  <td>
                    <span className="fr-text--sm" title={recommandation.recommandation}>
                      {recommandation.recommandation.length > 80 
                        ? `${recommandation.recommandation.substring(0, 80)}...`
                        : recommandation.recommandation
                      }
                    </span>
                  </td>
                  <td>
                    <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
                      <div className="fr-col">
                        <Select
                          label=""
                          nativeSelectProps={{
                            value: recommandation.statut,
                            onChange: (e) => handleStatutChange(recommandation.id, e.target.value),
                            disabled: updating === recommandation.id,
                            className: "fr-select--sm"
                          }}
                        >
                          {STATUTS_DISPONIBLES.map((statut) => (
                            <option key={statut.value} value={statut.value}>
                              {statut.label}
                            </option>
                          ))}
                        </Select>
                      </div>
                      {updating === recommandation.id && (
                        <div className="fr-col-auto">
                          <div className="fr-text--xs fr-text--alt">
                            Mise à jour...
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Accordion>
    </div>
  )
}
