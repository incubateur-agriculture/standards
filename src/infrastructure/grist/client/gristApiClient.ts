import axios from "axios";

const { GRIST_URL, GRIST_API_KEY, GRIST_DOC_ID } = process.env;

export const apiClient = axios.create({
    baseURL: `${GRIST_URL}/docs/${GRIST_DOC_ID}`,
    headers: { Authorization: `Bearer ${GRIST_API_KEY}`},
});
