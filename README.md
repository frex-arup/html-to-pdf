# HTML to PDF Converter

A Next.js application that converts self-contained HTML files to selectable-text PDFs using Puppeteer.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/frex-arup/html-to-pdf)

## 🌐 Live Demo

Deploy your own instance or try the live demo at your Vercel deployment URL.

## Features

- 📄 Upload self-contained HTML files (HTML + CSS + JS inline)
- 🔤 Generate PDFs with selectable, searchable text
- ⚡ Fast conversion powered by Puppeteer
- 🎨 Modern, responsive UI with glassmorphism design
- 📱 Drag and drop file upload support
- 📝 PDF filename automatically matches HTML title (defaults to `download.pdf`)

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation

1. Clone the repository:

```bash
git clone https://github.com/frex-arup/html-to-pdf.git
cd html-to-pdf
```

2. Install dependencies:

```bash
npm install
```

Note: The first run may take longer as Puppeteer downloads Chromium.

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm run start
```

## Deployment to Vercel

### Option 1: One-Click Deploy

Click the "Deploy with Vercel" button above, or:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/frex-arup/html-to-pdf)

### Option 2: Connect GitHub Repository

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import the `frex-arup/html-to-pdf` repository
4. Click "Deploy" (no configuration needed)

### Option 3: Vercel CLI

```bash
npm i -g vercel
vercel
```

## Usage

1. Open the application in your browser
2. Click the upload area or drag and drop an HTML file
3. Click "Generate PDF" button
4. Wait for processing (loading indicator shown)
5. PDF automatically downloads with the HTML's `<title>` as filename

## Example Test Flow

### Step 1: Create a Test HTML File

Create a file named `test.html` with the following content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>John Doe Resume</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        h2 {
            color: #3498db;
            margin-top: 25px;
            margin-bottom: 15px;
        }
        .contact {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
            margin-bottom: 30px;
            color: #666;
        }
        .section {
            margin-bottom: 25px;
        }
        .job {
            margin-bottom: 20px;
        }
        .job-title {
            font-weight: bold;
            color: #2c3e50;
        }
        .company {
            color: #7f8c8d;
            font-style: italic;
        }
        ul {
            margin-left: 20px;
            margin-top: 10px;
        }
        li {
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <h1>John Doe</h1>
    <div class="contact">
        <span>📧 john.doe@email.com</span>
        <span>📱 (555) 123-4567</span>
        <span>📍 New York, NY</span>
    </div>

    <div class="section">
        <h2>Summary</h2>
        <p>Experienced software engineer with 5+ years of experience in full-stack development.</p>
    </div>

    <div class="section">
        <h2>Experience</h2>
        <div class="job">
            <div class="job-title">Senior Software Engineer</div>
            <div class="company">Tech Corp Inc. | 2021 - Present</div>
            <ul>
                <li>Led development of microservices architecture serving 1M+ users</li>
                <li>Reduced API response time by 40% through optimization</li>
            </ul>
        </div>
    </div>

    <div class="section">
        <h2>Skills</h2>
        <p>JavaScript, TypeScript, React, Node.js, Python, AWS, Docker</p>
    </div>
</body>
</html>
```

### Step 2: Upload and Convert

1. Open the application
2. Upload `test.html`
3. Click "Generate PDF"
4. The file `John Doe Resume.pdf` will download automatically

## Project Structure

```
html-to-pdf/
├── app/
│   ├── layout.js              # Root layout
│   ├── page.js                # Main upload page (Client Component)
│   └── api/
│       └── upload-html/
│           └── route.js       # API route for PDF generation
├── next.config.js             # Next.js configuration
├── vercel.json                # Vercel deployment configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## API Endpoint

### POST `/api/upload-html`

**Request:**
- Content-Type: `multipart/form-data`
- Body: FormData with `file` field containing the HTML file

**Response:**
- Success: PDF binary with headers:
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename="<title>.pdf"` or `download.pdf`
- Error: JSON `{ "error": "error message" }`

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **PDF Generation**: Puppeteer (local) / @sparticuz/chromium (Vercel)
- **Styling**: Inline CSS with glassmorphism design
- **Deployment**: Vercel

## Troubleshooting

### Local Development Issues

If Puppeteer fails to download Chromium:

```bash
npx puppeteer browsers install chrome
```

### Vercel Deployment Issues

The app uses `@sparticuz/chromium` for serverless environments. If you encounter timeout issues:

1. Check `vercel.json` has sufficient `maxDuration` (default: 60s)
2. Check memory allocation (default: 1024MB)

## License

MIT
