'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@codegouvfr/react-dsfr/Button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="fr-container fr-py-8w">
      <div className="fr-alert fr-alert--error">
        <h3 className="fr-alert__title">Une erreur est survenue</h3>
        <p>
          Impossible de charger l&apos;audit. Cela peut être dû à un problème
          temporaire de connexion ou à une erreur serveur.
        </p>
      </div>
      <div className="fr-mt-4w">
        <Button
          onClick={reset}
          priority="primary"
        >
          Réessayer
        </Button>
      </div>
    </div>
  );
}

