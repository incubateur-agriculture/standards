import { useEffect, useState, useRef } from 'react'
import { Select } from '@codegouvfr/react-dsfr/Select'
import { Tag } from '@codegouvfr/react-dsfr/Tag'
import { ColumnOption } from '@/domain/types'

interface MultiSelectWithChipsProps {
  id: string
  label: string
  options: ColumnOption[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  onRemove?: (value: string) => void
  disabled?: boolean
  hint?: string
  loading?: boolean
}

export default function MultiSelectWithChips({
  id,
  label,
  options,
  selectedValues,
  onChange,
  onRemove,
  disabled = false,
  hint,
  loading = false
}: Readonly<MultiSelectWithChipsProps>) {
  const [selected, setSelected] = useState<string[]>(selectedValues || [])
  const [currentValue, setCurrentValue] = useState<string>("")
  const selectRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    setSelected(selectedValues || [])
  }, [selectedValues])

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    if (!value || selected.includes(value)) return
    
    const newSelected = [...selected, value]
    setSelected(newSelected)
    onChange(newSelected)
    
    // Reset select value after selection
    if (selectRef.current) {
      selectRef.current.value = ""
    }
    setCurrentValue("")
  }

  const handleRemoveTag = (valueToRemove: string) => {
    const newSelected = selected.filter(value => value !== valueToRemove)
    setSelected(newSelected)
    onChange(newSelected)
    
    // Appeler le callback de suppression si fourni
    if (onRemove) {
      onRemove(valueToRemove)
    }
  }

  // Filtrer les options pour n'afficher que celles qui ne sont pas déjà sélectionnées
  const availableOptions = options.filter(option => !selected.includes(option.id))

  return (
    <div className="fr-select-group">
      <label className="fr-label" htmlFor={id}>
        {label}
        {hint && <span className="fr-hint-text">{hint}</span>}
      </label>
      
      {/* Affichage des puces/tags pour les valeurs sélectionnées */}
      {selected.length > 0 && (
        <div className="fr-tags-group fr-mb-1w">
          {selected
            .map(value => {
              const option = options.find(opt => opt.id === value)
              return { value, option }
            })
            .sort((a, b) => (a.option?.label || a.value).localeCompare(b.option?.label || b.value))
            .map(({ value, option }) => (
              <Tag 
                key={value} 
                dismissible
                className="fr-mr-1w fr-mb-1w"
                nativeButtonProps={{
                  onClick: () => handleRemoveTag(value)
                }}
                aria-label={`Supprimer ${option?.label || value}`}
              >
                {option?.label || value}
              </Tag>
            ))
          }
        </div>
      )}
      
      {/* Select pour ajouter de nouvelles valeurs */}
      <Select
        label=""
        nativeSelectProps={{
          id,
          ref: selectRef,
          value: currentValue,
          onChange: handleSelectChange,
          disabled: disabled || loading || availableOptions.length === 0,
          "aria-label": `Ajouter une option pour ${label}`
        }}
        className="fr-mt-1w"
      >
        <option value="">Sélectionner...</option>
        {loading ? (
          <option value="" disabled>Chargement...</option>
        ) : availableOptions.length === 0 ? (
          <option value="" disabled>Toutes les options sont sélectionnées</option>
        ) : (
          availableOptions.map(option => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))
        )}
      </Select>
    </div>
  )
}