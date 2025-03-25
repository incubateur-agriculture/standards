export const GRIST = {
    QUESTIONS: {
        ID: "AuditsQuestions",
        FIELDS: {
            CATEGORIE: "Categorie",
            QUESTION: "Question",
            IMPORTANCE: "Importance",
            TOOLTIP: "Tooltip",
            STATUT: "Statut"
        }
    },
    AUDITS: {
        ID: "AuditsAudits",
        FIELDS: {
            HASH: "Hash",
            PRODUIT: "Produit",
            COMITE_INVESTISSEMENT: "Date_comite_d_investissment",
            CLOTURE: "Cloture",
            CLOTURE_LE: "Cloture_le"
        }
    },
    REPONSES: {
        ID: "AuditsReponses",
        FIELDS: {
            AUDIT: "Audit",
            QUESTION: "Question",
            REPONSE: "Reponse",
            COMMENTAIRES: "Commentaires_Details",
            POURCENTAGE: "Pourcentage"
        }
    },
    PRODUITS: {
        ID: "AuditsProduits",
        FIELDS: {
            NOM: "Nom",
            STARTUP: "Startup",
            STATUT: "Statut",
            TYPE_PROJET: "Type_de_projet",
            ARCHITECTURE: "Architecture",
            LANGUAGES: "Languages",
            DESCRIPTION: "Description",
            REPOSITORY: "Repository",
            HOMEPAGE: "Homepage",
            DEPENDANCES: "Dependances",
            OUTILS_MUTUALISES: "Outils_mutualises",
            OUTILS_NON_MUTUALISES: "Outils_non_mutualises",
            HEBERGEMENT: "Hebergement",
            FRONTEND: "Frontend",
            BACKEND: "Backend",
            AUTHENTIFICATION: "Authentification"
        }
    }
}; 