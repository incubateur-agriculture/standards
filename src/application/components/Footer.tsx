"use client";

import { Footer as DsfrFooter } from "@codegouvfr/react-dsfr/Footer";
import Link from "next/link";

export function Footer() {

  return (
    <DsfrFooter
      className="pb-4"
      brandTop={
        <>
          République
          <br />
          Française
        </>
      }
      homeLinkProps={{
        href: "/",
        title: "Accueil - Audit technique - ANCT",
      }}
      operatorLogo={{
        imgUrl: "/assets/logos/ruche.png",
        alt: "Logo de la Ruche Numérique",
        orientation: "horizontal",
      }}
      accessibility="non compliant"
      accessibilityLinkProps={{
        href: "/declaration-accessibilite",
        title: "Accessibilité: non conforme",
        className: "border-b border-slate-800 hover:border-b-1",
      }}
      contentDescription={
        <>
          Ce site est un outil d&apos;audit technique de la Ruche Numérique.
          Son code source est publié en open source et disponible sur <a href="https://github.com/incubateur-agriculture/standards" target="_blank" rel="noopener noreferrer">GitHub</a>. 
          Le design s&apos;appuie sur le système de design de l&apos;État.
        </>
      }
      bottomItems={[
        <Link
          className="fr-text--xs"
          href="/mentions-legales"
          key="mentions-legales"
        >
          Mentions légales
        </Link>,
        <Link
          className="fr-text--xs"
          href="/donnees-personnelles"
          key="donnees-personnelles"
        >
          Données personnelles
        </Link>,
      ]}
    />
  );
}
