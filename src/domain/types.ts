export enum REPONSE_OPTIONS {
    OUI="Oui",
    NON="Non",
    NE_SAIS_PAS="Ne sais pas",
    NON_APPLICABLE="N/A",
}

export enum IMPORTANCE_OPTION {
    P0="P0",
    P1="P1",
    P2="P2",
    P3="P3",
}

export interface Categorie {
    titre: string
    questions: Question[]
}

export interface Question {
    id: number
    question: string
    tooltip: string
    importance: IMPORTANCE_OPTION
    reponse: Reponse|null
    previousReponse: Reponse|null
}

export interface Produit {
    id: number
    nom: string
    startupId?: number
    statut?: string
    typeProjet?: string
    architecture?: string
    languages?: string[]
    description?: string
    repository?: string
    homepage?: string
    dependances?: string[]
    outilsMutualises?: string[]
    outilsNonMutualises?: string[]
    hebergement?: string[]
    frontend?: string[]
    backend?: string[]
    authentification?: string[]
}

export interface ColumnOption {
    id: string
    label: string
}

export interface Audit {
    id: number
    dateComiteInvestissement: Date
    produit: Produit
    cloture: boolean
    clotureLe: Date
}

export interface Reponse {
    id?: number
    auditId: number
    questionId: number
    reponse: REPONSE_OPTIONS|null
    commentaire: string|null
    pourcentage: number|null
    reset?: boolean
    commentaireModified?: boolean
}

export interface Startup {
    id?: number
    nom: string
    acronyme: string
    intra: string
    actif: boolean
    incubateur: string
    statut?: string
    typologieProduit?: string
    baseRh?: string
    idCanalMattermost?: string
    outilsStartups?: string[]
}

export interface Collaborateur {
    id?: number
    idBeta: string
    nomComplet: string
    domaine: string
}

export interface OutilsStartupsMapping {
    id?: number
    startupId: number
    outilId: number
    usage?: string
}

export interface GristPostRecord {
    fields?: {
        [key: string]: any
    }
}

export interface GristPutRecord {
    id?: number
    require: {
        [key: string]: any
    },
    fields?: {
        [key: string]: any
    }
}

export interface GristGetRecord {
    id?: number
    fields: {
        [key: string]: any
    }
}

export interface Consommation {
    id: number
    produitId: number
    outil: string
    identifiant: string
    cout: number
    detail: string
    date: Date
}

export interface MappingProduitHebergement {
    id: number
    identifiantOutil: string
}