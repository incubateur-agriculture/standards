import { useEffect, useState } from 'react'
import { Produit, ColumnOption } from '@/domain/types'
import MultiSelectWithChips from './MultiSelectWithChips'
import { 
  getOutilsMutualisesOptions, 
  getOutilsNonMutualisesOptions 
} from '@/infrastructure/repositories/produitRepository'

interface OutilsSelectorProps {
  produit: Produit | null
  onOutilsMutualisesChange: (values: string[]) => void
  onOutilsNonMutualisesChange: (values: string[]) => void
  disabled?: boolean
}

export default function OutilsSelector({
  produit,
  onOutilsMutualisesChange,
  onOutilsNonMutualisesChange,
  disabled = false
}: Readonly<OutilsSelectorProps>) {
  const [outilsMutualisesOptions, setOutilsMutualisesOptions] = useState<ColumnOption[]>([])
  const [outilsNonMutualisesOptions, setOutilsNonMutualisesOptions] = useState<ColumnOption[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch options on component mount
  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true)
      try {
        const [mutualisesOptions, nonMutualisesOptions] = await Promise.all([
            getOutilsMutualisesOptions(),
            getOutilsNonMutualisesOptions()
        ])
        
        setOutilsMutualisesOptions(mutualisesOptions)
        setOutilsNonMutualisesOptions(nonMutualisesOptions)
      } catch (error) {
        console.error('Failed to fetch options:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchOptions()
  }, [])

  return (
    <div className="fr-grid-row fr-grid-row--gutters">
      <div className="fr-col-12 fr-col-md-6">
        <MultiSelectWithChips
          id="outils-mutualises"
          label="Outils mutualisés"
          options={outilsMutualisesOptions}
          selectedValues={produit?.outilsMutualises || []}
          onChange={onOutilsMutualisesChange}
          disabled={disabled}
          loading={loading}
          hint="Sélectionnez les outils mutualisés utilisés"
        />
      </div>
      <div className="fr-col-12 fr-col-md-6">
        <MultiSelectWithChips
          id="outils-non-mutualises"
          label="Outils non mutualisés"
          options={outilsNonMutualisesOptions}
          selectedValues={produit?.outilsNonMutualises || []}
          onChange={onOutilsNonMutualisesChange}
          disabled={disabled}
          loading={loading}
          hint="Sélectionnez les outils non mutualisés utilisés"
        />
      </div>
    </div>
  )
} 