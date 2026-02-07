import puppeteerCore from 'puppeteer-core';
import puppeteer from 'puppeteer';
import chromium from '@sparticuz/chromium-min';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Extract title from HTML content
function extractTitleFromHTML(html) {
    // Try to match <title>...</title> tag
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
        // Clean up the title - remove invalid filename characters
        let title = titleMatch[1].trim();
        // Replace invalid filename characters with underscores
        title = title.replace(/[<>:"/\\|?*]/g, '_');
        // Limit length and trim whitespace
        title = title.substring(0, 100).trim();
        if (title) {
            return title;
        }
    }
    return null;
}

// Check if running in Vercel (serverless) environment
const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

async function getBrowser() {
    if (isVercel) {
        // Use @sparticuz/chromium for Vercel serverless
        return puppeteerCore.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });
    } else {
        // Use regular puppeteer for local development
        return puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
            ],
        });
    }
}

export async function POST(request) {
    let browser = null;

    try {
        // Parse the multipart form data
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return Response.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.name.endsWith('.html') && file.type !== 'text/html') {
            return Response.json(
                { error: 'Only HTML files are allowed' },
                { status: 400 }
            );
        }

        // Read the HTML content from the uploaded file
        const htmlContent = await file.text();

        if (!htmlContent.trim()) {
            return Response.json(
                { error: 'The uploaded HTML file is empty' },
                { status: 400 }
            );
        }

        // Extract title from HTML for PDF filename
        const htmlTitle = extractTitleFromHTML(htmlContent);
        const pdfFilename = htmlTitle ? `${htmlTitle}.pdf` : 'download.pdf';

        // Launch browser (handles both local and Vercel environments)
        browser = await getBrowser();

        // Create a new page
        const page = await browser.newPage();

        // Set the HTML content
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0',
            timeout: 30000,
        });

        // Generate PDF with Letter format
        const pdfBuffer = await page.pdf({
            format: 'Letter',
            printBackground: true,
            margin: {
                top: '0.5in',
                right: '0.5in',
                bottom: '0.5in',
                left: '0.5in',
            },
        });

        // Close the browser
        await browser.close();
        browser = null;

        // Return the PDF with appropriate headers
        return new Response(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${pdfFilename}"`,
                'Content-Length': pdfBuffer.length.toString(),
            },
        });

    } catch (error) {
        console.error('PDF generation error:', error);

        // Make sure browser is closed on error
        if (browser) {
            try {
                await browser.close();
            } catch (closeError) {
                console.error('Error closing browser:', closeError);
            }
        }

        return Response.json(
            { error: 'Failed to generate PDF: ' + error.message },
            { status: 500 }
        );
    }
}
