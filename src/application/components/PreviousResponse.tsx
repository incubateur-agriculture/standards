import { REPONSE_NON } from "@/app/constants";
import { Reponse } from "@/domain/types";

interface PreviousResponseProps {
  previousReponse: Reponse;
}

export default function PreviousResponse({ previousReponse }: Readonly<PreviousResponseProps>) {
  if (!previousReponse) {
    return null;
  }

  return (
    <div className="fr-background-alt--grey p-2 rounded-lg mt-2">
      <div className="flex items-center gap-2 text-gray-600">
        <span className="fr-text--s">Précédemment : {previousReponse.reponse} </span>
        {previousReponse.reponse === REPONSE_NON && 
          previousReponse.pourcentage ? (
          <span className="fr-text--s">({previousReponse.pourcentage}%) </span>
        ) : null}
        {previousReponse.commentaire && (
          <span className="fr-text--s truncate max-w-xl">
            - {previousReponse.commentaire}
          </span>
        )}
      </div>
    </div>
  );
} 