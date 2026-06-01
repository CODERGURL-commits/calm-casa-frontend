import "./globals.css";

export const metadata= {
    title: "CalmCasa",
    description: "A cozy space to just be.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="antialiased">
                {children}
            </body>
            </html>
    );
}