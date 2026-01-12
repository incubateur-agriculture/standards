import axios from "axios";

const { GRIST_URL, GRIST_API_KEY, GRIST_DOC_ID } = process.env;

export const apiClient = axios.create({
    baseURL: `${GRIST_URL}/docs/${GRIST_DOC_ID}`,
    headers: { Authorization: `Bearer ${GRIST_API_KEY}`},
    timeout: 30000,
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.error
            || error.message
            || 'Une erreur est survenue lors de la communication avec Grist';
        const statusCode = error.response?.status || 500;

        const gristError = new Error(`[Grist API] ${statusCode}: ${message}`);
        gristError.name = 'GristApiError';

        return Promise.reject(gristError);
    }
);
