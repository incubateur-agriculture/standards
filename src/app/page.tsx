export default async function Page() {

    console.log('La page index est chargée');

    return (
        <div role="main" id="content">
            <div className="fr-mb-md-14v pt-20 max-w-screen-lg mx-auto px-4">
                <h1>Bienvenue dans l&apos;outil d&apos;audit technique de l&apos;Incubateur des Territoires.</h1>
                
                <p>
                    Conçu par l&apos;équipe transverse de <a href="https://incubateur.anct.gouv.fr/">l&apos;Incubateur des Territoires</a>, cet outil permet d&apos;évaluer les startups afin de les préparer aux comités d&apos;investissement.<br />
                    L&apos;objectif de l&apos;audit est de mettre en lumière la dette technique et de garantir la pérennité des produits numériques développés.<br />
                    Pour explorer les fonctionnalités de l&apos;outil, <a href={`/audit/vBWpr47e`}>voici un exemple d&apos;audit.</a><br />
                    Pour accéder à l&apos;audit spécifique à votre startup, veuillez utiliser le lien fourni par l&apos;équipe transverse.
                </p>
            </div>
        </div>
    );
}
