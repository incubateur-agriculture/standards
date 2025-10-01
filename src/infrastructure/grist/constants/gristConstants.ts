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
    PRODUITS_ET_OUTILS: {
        ID: "ProduitsEtOutils",
        FIELDS: {
            TYPE: "Type",
            MUTUALISE: "Mutualise",
            NOM: "Nom_du_produits",
        }
    },
    PRODUITS: {
        ID: "AuditsProduits",
        FIELDS: {
            TYPE: "Type",
            MUTUALISE: "Mutualise",
            NOM: "Nom",
            STARTUP_ID: "Produit_maitre_Start_up",
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
    },
    STARTUPS: {
        ID: "Start_up",
        FIELDS: {
            NOM: "Nom_de_la_start_up",
            ACRONYME: "Acronyme",
            INTRA: "Intra",
            ACTIF: "Actif",
            INCUBATEUR: "Incubateur",
            STATUT: "Statut",
            TYPOLOGIE_PRODUIT: "Typologie_produit",
            BASE_RH: "Base_RH",
            ID_CANAL_MATTERMOST: "Canal_mattermost",
            OUTILS_STARTUPS: "Outils_des_Start_ups"
        }
    },
    OUTILS_STARTUPS: {
        ID: "Outils_des_Start_ups",
        FIELDS: {
            STARTUP: "Start_up",
            OUTIL: "Outil",
            USAGE: "Usage"
        }
    }
}; 