import { getAudit } from "@/infrastructure/repositories/auditRepository";
import { fr } from "@codegouvfr/react-dsfr";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ auditHash: string }>;
} ): Promise<Metadata> {
  try {
    const audit = await getAudit((await params).auditHash);

    return {
      title: audit?.produit.nom
        ? `${audit.produit.nom} - Audit technique - Incubateur - ANCT`
        : 'Audit technique - Incubateur - ANCT',
    };
  } catch {
    return {
      title: 'Audit technique - Incubateur - ANCT',
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
  );
}
