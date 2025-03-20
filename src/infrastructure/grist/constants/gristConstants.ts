export const GRIST = {
    QUESTIONS: {
        ID: "Table1",
        FIELDS: {
            CATEGORIE: "Categorie",
            QUESTION: "Question",
            IMPORTANCE: "Importance",
            TOOLTIP: "Tooltip",
            STATUT: "Statut"
        }
    },
    AUDITS: {
        ID: "Audits",
        FIELDS: {
            ID: "ID2",
            HASH: "Hash",
            PRODUIT: "Produit",
            COMITE_INVESTISSEMENT: "Date_comite_d_investissment",
            CLOTURE: "Cloture",
            CLOTURE_LE: "Cloture_le"
        }
    },
    REPONSES: {
        ID: "Reponses",
        FIELDS: {
            AUDIT: "Audit",
            QUESTION: "Question",
            REPONSE: "Reponse",
            COMMENTAIRES: "Commentaires_Details",
            POURCENTAGE: "Pourcentage"
        }
    },
    PRODUITS: {
        ID: "Produits",
        FIELDS: {
            ID: "ID2",
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
            OUTILS_AAS: "Outils_AAS",
            HEBERGEMENT: "Hebergement",
            FRONTEND: "Frontend",
            BACKEND: "Backend",
            AUTHENTIFICATION: "Authentification"
        }
    },
    STARTUPS: {
        ID: "Startups",
        FIELDS: {
            ID_BETA: "Id_Beta",
            MEMBRES: "Membres"
        }
    },
    COLLABORATEURS: {
        ID: "Collaborateurs",
        FIELDS: {
            ID_BETA: "idBeta",
            NOM_COMPLET: "Nom_complet",
            DOMAINE: "Domaine"
        }
    }
}; 