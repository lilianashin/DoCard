// app/+html.tsx
import { Html, Head, Main, NextScript } from 'expo-router';

export default function RootHtml() {
    return (
        <Html lang="en">
            <Head>
                <meta name="description" content="DoCard lets you create study decks and image-enabled flashcards. Flip, score, and review." />
                <meta name="theme-color" content="#007bff" />
                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="DoCard – Study decks, flashcards with images" />
                <meta property="og:description" content="Create decks, add images to both sides, study and track your score." />
                <meta property="og:image" content="/og-image.png" />
                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="DoCard – Study decks, flashcards with images" />
                <meta name="twitter:description" content="Create decks, add images to both sides, study and track your score." />
                <meta name="twitter:image" content="/og-image.png" />
                <link rel="canonical" href="https://YOUR_DOMAIN_OR_GITHUB_PAGES_URL" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
                        "@context":"https://schema.org",
                        "@type":"SoftwareApplication",
                        name:"DoCard",
                        applicationCategory:"EducationalApplication",
                        operatingSystem:"Web, iOS, Android",
                        description:"Create and study image-enabled flashcards.",
                        offers:{ "@type":"Offer", price:"0", priceCurrency:"EUR" }
                    })}} />
            </Head>
            <body>
            <Main />
            <NextScript />
            </body>
        </Html>
    );
}
