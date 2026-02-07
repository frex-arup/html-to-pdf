export const metadata = {
    title: 'HTML to PDF Converter',
    description: 'Upload HTML files and convert them to selectable-text PDFs',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
