import { Footer } from "@/application/components/Footer";
import { fr } from "@codegouvfr/react-dsfr";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import Header from "@codegouvfr/react-dsfr/Header";
import MuiDsfrThemeProvider from "@codegouvfr/react-dsfr/mui";
import { getHtmlAttributes, DsfrHead } from "../dsfr-bootstrap/server-only-index";
import { Metadata } from "next";
import Link from "next/link";
import { NextAppDirEmotionCacheProvider } from "tss-react/next/appDir";
import { ConsentBannerAndConsentManagement } from "../application/components/consentManagement";
import { DsfrProvider, StartDsfrOnHydration } from "../dsfr-bootstrap";
import { Matomo } from "@/application/components/Matomo";

export const metadata: Metadata = {
  title: {
    default: "Audit technique - Incubateur des Territoires (ANCT)",
    template: "%s | Audit technique - Incubateur des Territoires (ANCT)",
  },
};

export default async function RootLayout({
  children,
}: {
  children: any;
}) {
  return (
    <html {...getHtmlAttributes({ lang: "fr" })}>
      <head>
        <DsfrHead
          preloadFonts={[
            //"Marianne-Light",
            //"Marianne-Light_Italic",
            "Marianne-Regular",
            //"Marianne-Regular_Italic",
            "Marianne-Medium",
            //"Marianne-Medium_Italic",
            "Marianne-Bold",
            //"Marianne-Bold_Italic",
            //"Spectral-Regular",
            //"Spectral-ExtraBold"
          ]}
        />
        <Matomo/>
      </head>
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DsfrProvider lang="fr">
          <ConsentBannerAndConsentManagement />
          <NextAppDirEmotionCacheProvider options={{ key: "css" }}>
            <MuiDsfrThemeProvider>
              <Header
                className="pb-4"
                brandTop={<>République<br/>Française</>}
                operatorLogo={{
                  imgUrl: "/assets/logos/anct.svg",
                  alt: "Logo de l'Agence Nationale de la Cohésion des Territoires",
                  orientation: "horizontal",
                }}
                serviceTitle={"Audits techniques - Incubateur des territoires - ANCT"}
                homeLinkProps={{
                  href: "/",
                  title: "Audits techniques - Incubateur des Territoires - ANCT",
                }}
                quickAccessItems={[headerFooterDisplayItem]}
              />
              <div
                style={{
                  flex: 1,
                  margin: "auto",
                  maxWidth: 1000,
                  ...fr.spacing("padding", {
                    topBottom: "10v",
                  }),
                }}
              >
                {children}
              </div>
            </MuiDsfrThemeProvider>
            <Footer />
          </NextAppDirEmotionCacheProvider>
          <StartDsfrOnHydration />
        </DsfrProvider>
      </body>
    </html>
  );
}
