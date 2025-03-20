import 'dotenv/config'

import { Collaborateur, Startup } from "@/domain/types";
import axios from "axios";
import { getGristStartups, setStartupMembers } from '@/infrastructure/grist/repositories/startupsGristRepository';
import { saveCollaborateurs } from '@/infrastructure/grist/repositories/collaborateursGristRepository';

if (!process.env.GRIST_API_KEY || !process.env.GRIST_DOC_ID || !process.env.GRIST_URL) {
    console.error('Missing environment variables', {
        GRIST_URL: process.env.GRIST_URL,
        GRIST_API_KEY: process.env.GRIST_API_KEY,
        GRIST_DOC_ID: process.env.GRIST_DOC_ID
    });
    throw new Error('Missing environment variables');
}

interface StartupBeta {
    active_members: string[]
    name: string
}

interface MappedStartup extends Startup {
    beta: StartupBeta
}

const betaClient = axios.create({
    baseURL: 'https://beta.gouv.fr/api/v2.6'
});

(async () => {
    console.log('Start importation');

    const startups: Record<string, StartupBeta> = (await betaClient.get('/startups_details.json')).data;

    const startupsIncubateur = (await getGristStartups());
    
    const mappingStartups: Record<string, MappedStartup> = startupsIncubateur.reduce((acc, startup: Startup) => {
        if (startup.idBeta !== '' && startups[startup.idBeta]) {
            return {
                [startup.idBeta]: {
                    ...startup,
                    beta: startups[startup.idBeta],
                },
                ...acc
            }
        }
        return acc;
    }, {});

    const authors: Record<string, Collaborateur> = (await betaClient.get('/authors.json')).data.reduce((acc: Record<string, any>, author: any) => {

        return {
            ...acc,
            [author.id]: {
                idBeta: author.id,
                nomComplet: author.fullname,
                domaine: author.domaine,
            }
        };
    }, {});

    for (const startup of Object.values(mappingStartups)) {
        const members = await saveCollaborateurs(startup.beta.active_members.map((member) => authors[member]));

        await setStartupMembers(startup, members);
    }

    console.log('...end importation');
})();
