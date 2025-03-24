import { ColumnOption } from "@/domain/types"
import { apiClient } from "@/infrastructure/grist/client/gristApiClient"
import { GRIST } from "@/infrastructure/grist/constants/gristConstants"

/**
 * Fetches the available options for a specific column from Grist
 * @param tableName The table name in Grist
 * @param columnName The column name to fetch options for
 * @returns Array of options with id and label
 */
export async function fetchColumnOptions(tableName: string, columnId: string): Promise<ColumnOption[]> {
  try {
    const response = await apiClient.get(`/tables/${tableName}/columns`)
    
    // Le format de réponse est différent de ce qui était attendu initialement
    // Il s'agit d'un tableau d'objets de colonnes avec leurs propriétés
    if (response.data && Array.isArray(response.data.columns)) {
      // Chercher la colonne correspondant à notre ID
      const column = response.data.columns.find((col: any) => col.id === columnId)

      if (column && column.fields && column.fields.widgetOptions) {
        try {
          // widgetOptions est une chaîne JSON contenant les choix possibles
          const widgetOptions = JSON.parse(column.fields.widgetOptions)
          
          if (widgetOptions.choices && Array.isArray(widgetOptions.choices)) {
            // Transformation en format ColumnOption
            return widgetOptions.choices.map((option: string) => ({
              id: option,
              label: option
            }))
          }
        } catch (parseError) {
          console.error(`Error parsing widgetOptions for column ${columnId}:`, parseError)
        }
      }
    }
    
    return []
  } catch (error) {
    console.error(`Failed to fetch column options for ${columnId}:`, error)
    return []
  }
}

/**
 * Fetches available options for Outils mutualisés
 */
export async function fetchOutilsMutualisesOptions(): Promise<ColumnOption[]> {
  return fetchColumnOptions(GRIST.PRODUITS.ID, "Outils_mutualises")
}

/**
 * Fetches available options for Outils non mutualisés
 */
export async function fetchOutilsNonMutualisesOptions(): Promise<ColumnOption[]> {
  return fetchColumnOptions(GRIST.PRODUITS.ID, "Outils_non_mutualises")
} 