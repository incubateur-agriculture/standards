'use client'

import { Consommation as ConsommationType } from '@/domain/types'
import { getConsommationsDuDernierMois } from '@/infrastructure/repositories/consommationRepository'
import { Accordion } from '@codegouvfr/react-dsfr/Accordion'
import { useEffect, useState } from 'react'

interface ConsommationProps {
  produitId: number
}

export default function Consommation({ produitId }: ConsommationProps) {
  const [consommations, setConsommations] = useState<ConsommationType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConsommations = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await getConsommationsDuDernierMois(produitId)
        setConsommations(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      } finally {
        setLoading(false)
      }
    }

    if (produitId) {
      fetchConsommations()
    }
  }, [produitId])

  if (loading) {
    return (
      <div className="fr-mb-3w">
        <Accordion label="Consommations d'infrastructure du dernier mois">
            <div className="fr-text--sm">Chargement des consommations...</div>
        </Accordion>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fr-mb-3w">
        <Accordion label="Consommations d'infrastructure du dernier mois">
            <div className="fr-text--sm fr-text--error">
              {error}
            </div>
        </Accordion>
      </div>
    )
  }

  if (!consommations || consommations.length === 0) {
    return (
      <div className="fr-mb-3w">
        <Accordion label="Consommations d'infrastructure du dernier mois">
            <div className="fr-text--sm">
              Aucune consommation enregistrée pour le dernier mois.
            </div>
        </Accordion>
      </div>
    )
  }

  return (
    <div className="fr-mb-3w">
      <Accordion
        label={`Consommations d'infrastructure du dernier mois (${consommations?.reduce((acc, conso) => acc + conso.cout, 0).toLocaleString('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        })})`}
      >
        <div className="fr-table">
        <table className="fr-table">
            <thead>
            <tr>
                <th scope="col">Outil</th>
                <th scope="col">Identifiant</th>
                <th scope="col">Coût</th>
                <th scope="col">Détail</th>
            </tr>
            </thead>
            <tbody>
            {consommations?.map((consommation) => (
                <tr key={consommation.id}>
                <td>
                    <span className="fr-text--sm fr-text--bold">
                    {consommation.outil}
                    </span>
                </td>
                <td>
                    <span className="fr-text--sm">
                    {consommation.identifiant ?? '-'}
                    </span>
                </td>
                <td>
                    <span className="fr-text--sm">
                    {consommation.cout.toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR'
                    })}
                    </span>
                </td>
                <td>
                    <span className="fr-text--sm whitespace-pre-line">
                    {consommation.detail}
                    </span>
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
