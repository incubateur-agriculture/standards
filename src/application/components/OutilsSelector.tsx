'use client'
import { useEffect, useState } from 'react'
import { ColumnOption, OutilsStartupsMapping } from '@/domain/types'
import MultiSelectWithChips from './MultiSelectWithChips'
import { 
  getAllOutilsMutualises, 
  getAllOutilsNonMutualises,
  getOutilsStartupsMapping,
  editOutilsStartupsMapping,
  deleteOutilsStartupsMapping,
  createOutilNonMutualise
} from '@/infrastructure/repositories/outilsRepository'

interface OutilsSelectorProps {
  startupId: number
  disabled?: boolean
}

export default function OutilsSelector({
  startupId,
  disabled = false
}: Readonly<OutilsSelectorProps>) {
  const [outilsMutualisesOptions, setOutilsMutualisesOptions] = useState<ColumnOption[]>([])
  const [outilsNonMutualisesOptions, setOutilsNonMutualisesOptions] = useState<ColumnOption[]>([])
  const [selectedMutualises, setSelectedMutualises] = useState<string[]>([])
  const [selectedNonMutualises, setSelectedNonMutualises] = useState<string[]>([])
  const [existingMappings, setExistingMappings] = useState<OutilsStartupsMapping[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [customOutilName, setCustomOutilName] = useState('')
  const [isAddingCustomOutil, setIsAddingCustomOutil] = useState(false)

  // Fetch options and existing mappings on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [mutualisesOutils, nonMutualisesOutils, existingMappings] = await Promise.all([
            getAllOutilsMutualises(),
            getAllOutilsNonMutualises(),
            getOutilsStartupsMapping(startupId)
        ])
        
        // Transform Produit[] to ColumnOption[]
        const mutualisesOptions: ColumnOption[] = mutualisesOutils.map(outil => ({
          id: outil.id.toString(),
          label: outil.nom
        }))
        
        const nonMutualisesOptions: ColumnOption[] = nonMutualisesOutils.map(outil => ({
          id: outil.id.toString(),
          label: outil.nom
        }))
        
        setOutilsMutualisesOptions(mutualisesOptions)
        setOutilsNonMutualisesOptions(nonMutualisesOptions)
        setExistingMappings(existingMappings)
        
        // Extract selected tools from existing mappings
        const mutualisesIds = existingMappings
          .filter(mapping => mutualisesOptions.some(option => option.id === mapping.outilId.toString()))
          .map(mapping => mapping.outilId.toString())
        
        const nonMutualisesIds = existingMappings
          .filter(mapping => nonMutualisesOptions.some(option => option.id === mapping.outilId.toString()))
          .map(mapping => mapping.outilId.toString())
        
        setSelectedMutualises(mutualisesIds)
        setSelectedNonMutualises(nonMutualisesIds)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [startupId])

  // Fonction pour sauvegarder un mapping d'outil
  const saveOutilsMapping = async (outilId: string) => {
    const mapping: OutilsStartupsMapping = {
      startupId: startupId,
      outilId: parseInt(outilId),
    }

    try {
      setSaving(true)
      await editOutilsStartupsMapping(mapping)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du mapping:', error)
    } finally {
      setSaving(false)
    }
  }

  // Fonction pour supprimer un mapping d'outil
  const removeOutilsMapping = async (outilId: string) => {
    try {
      setSaving(true)
      
      // Trouver le mapping existant pour cet outil
      const mappingToDelete = existingMappings.find(
        mapping => mapping.outilId.toString() === outilId
      )
      
      if (mappingToDelete?.id) {
        await deleteOutilsStartupsMapping(mappingToDelete.id)
        
        // Mettre à jour la liste des mappings existants
        setExistingMappings(prev => 
          prev.filter(mapping => mapping.id !== mappingToDelete.id)
        )
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du mapping:', error)
    } finally {
      setSaving(false)
    }
  }

  // Handler pour les outils mutualisés
  const handleOutilsMutualisesChange = (values: string[]) => {
    const previousValues = selectedMutualises
    setSelectedMutualises(values)
    
    // Trouver les nouveaux outils ajoutés
    const addedTools = values.filter(value => !previousValues.includes(value))
    // Trouver les outils supprimés
    const removedTools = previousValues.filter(value => !values.includes(value))
    
    // Sauvegarder les nouveaux outils
    addedTools.forEach(outilId => {
      saveOutilsMapping(outilId)
    })
    
    // Supprimer les outils retirés
    removedTools.forEach(outilId => {
      removeOutilsMapping(outilId)
    })
  }

  // Handler pour les outils non mutualisés
  const handleOutilsNonMutualisesChange = (values: string[]) => {
    const previousValues = selectedNonMutualises
    setSelectedNonMutualises(values)
    
    // Trouver les nouveaux outils ajoutés
    const addedTools = values.filter(value => !previousValues.includes(value))
    // Trouver les outils supprimés
    const removedTools = previousValues.filter(value => !values.includes(value))
    
    // Sauvegarder les nouveaux outils
    addedTools.forEach(outilId => {
      saveOutilsMapping(outilId)
    })
    
    // Supprimer les outils retirés
    removedTools.forEach(outilId => {
      removeOutilsMapping(outilId)
    })
  }

  // Handler pour la suppression directe d'un outil mutualisé
  const handleRemoveMutualise = (outilId: string) => {
    removeOutilsMapping(outilId)
  }

  // Handler pour la suppression directe d'un outil non mutualisé
  const handleRemoveNonMutualise = (outilId: string) => {
    removeOutilsMapping(outilId)
  }

  // Handler pour ajouter un outil personnalisé
  const handleAddCustomOutil = async () => {
    if (!customOutilName.trim()) return

    try {
      setIsAddingCustomOutil(true)
      
      // Créer le nouvel outil et l'associer automatiquement à la startup
      const nouvelOutil = await createOutilNonMutualise(customOutilName.trim(), startupId)
      
      // Ajouter l'outil à la liste des options
      const nouvelleOption: ColumnOption = {
        id: nouvelOutil.id.toString(),
        label: nouvelOutil.nom
      }
      
      setOutilsNonMutualisesOptions(prev => [...prev, nouvelleOption])
      
      // Sélectionner automatiquement le nouvel outil
      const newSelectedValues = [...selectedNonMutualises, nouvelOutil.id.toString()]
      setSelectedNonMutualises(newSelectedValues)
      
      // Ajouter le mapping à la liste des mappings existants
      const nouveauMapping: OutilsStartupsMapping = {
        startupId: startupId,
        outilId: nouvelOutil.id
      }
      setExistingMappings(prev => [...prev, nouveauMapping])
      
      // Vider l'input
      setCustomOutilName('')
      
    } catch (error) {
      console.error('Erreur lors de la création de l\'outil personnalisé:', error)
    } finally {
      setIsAddingCustomOutil(false)
    }
  }

  // Handler pour la touche Entrée dans l'input
  const handleCustomOutilKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddCustomOutil()
    }
  }

  return (
    <div className="fr-grid-row fr-grid-row--gutters">
      <div className="fr-col-12 fr-col-md-6">
        <MultiSelectWithChips
          id="outils-mutualises"
          label="Outils mutualisés de l'incubateur"
          options={outilsMutualisesOptions}
          selectedValues={selectedMutualises}
          onChange={handleOutilsMutualisesChange}
          onRemove={handleRemoveMutualise}
          disabled={disabled || saving}
          loading={loading}
          hint="Sélectionnez les outils de l'incubateur utilisés dans le contexte de ce produit"
        />
      </div>
      <div className="fr-col-12 fr-col-md-6">
        <MultiSelectWithChips
          id="outils-non-mutualises"
          label="Outils non mutualisés"
          options={outilsNonMutualisesOptions}
          selectedValues={selectedNonMutualises}
          onChange={handleOutilsNonMutualisesChange}
          onRemove={handleRemoveNonMutualise}
          disabled={disabled || saving}
          loading={loading}
          hint="Sélectionnez les autres outils utilisés dans le contexte de ce produit"
        />
        
        {/* Input pour ajouter un outil personnalisé */}
        <div className="fr-mt-2w">
          <div className="fr-input-group">
            <label 
              className="fr-label" 
              htmlFor="custom-outil-input"
            >
              Ajouter un outil non mutualisé qui n&apos;est pas dans la liste
            </label>
            <div className="fr-input-wrap fr-input-wrap--addon">
              <input
                id="custom-outil-input"
                className="fr-input"
                type="text"
                placeholder="Nom de l'outil..."
                value={customOutilName}
                onChange={(e) => setCustomOutilName(e.target.value)}
                onKeyDown={handleCustomOutilKeyDown}
                disabled={disabled || saving || isAddingCustomOutil}
                aria-describedby="custom-outil-hint"
              />
              <button
                className="fr-btn"
                type="button"
                onClick={handleAddCustomOutil}
                disabled={disabled || saving || isAddingCustomOutil || !customOutilName.trim()}
                aria-label="Ajouter l'outil personnalisé"
              >
                {isAddingCustomOutil ? 'Ajout...' : 'Ajouter'}
              </button>
            </div>
            <div 
              id="custom-outil-hint" 
              className="fr-hint-text"
            >
              Tapez le nom d&apos;un outil non mutualisé et appuyez sur Entrée ou cliquez sur &quo;Ajouter&quo;
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 