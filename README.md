# HTML to PDF Converter

A Next.js application that converts self-contained HTML files to selectable-text PDFs using Puppeteer.

## Features

- 📄 Upload self-contained HTML files (HTML + CSS + JS inline)
- 🔤 Generate PDFs with selectable, searchable text
- ⚡ Fast conversion powered by Puppeteer
- 🎨 Modern, responsive UI with glassmorphism design
- 📱 Drag and drop file upload support

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation

1. Navigate to the project directory:

```bash
cd html-upload-to-pdf-nextjs
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

## Usage

1. Open `http://localhost:3000` in your browser
2. Click the upload area or drag and drop an HTML file
3. Click "Generate PDF" button
4. Wait for processing (loading indicator shown)
5. PDF automatically downloads as `Resume.pdf`

## Example Test Flow

### Step 1: Create a Test HTML File

Create a file named `test.html` with the following content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample Resume</title>
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
        <p>Experienced software engineer with 5+ years of experience in full-stack development. Passionate about building scalable applications and mentoring junior developers.</p>
    </div>

    <div class="section">
        <h2>Experience</h2>
        
        <div class="job">
            <div class="job-title">Senior Software Engineer</div>
            <div class="company">Tech Corp Inc. | 2021 - Present</div>
            <ul>
                <li>Led development of microservices architecture serving 1M+ users</li>
                <li>Reduced API response time by 40% through optimization</li>
                <li>Mentored team of 5 junior developers</li>
            </ul>
        </div>

        <div class="job">
            <div class="job-title">Software Engineer</div>
            <div class="company">StartupXYZ | 2019 - 2021</div>
            <ul>
                <li>Built React-based dashboard used by 500+ enterprise clients</li>
                <li>Implemented CI/CD pipeline reducing deployment time by 60%</li>
            </ul>
        </div>
    </div>

    <div class="section">
        <h2>Skills</h2>
        <p>JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, PostgreSQL, MongoDB, GraphQL</p>
    </div>

    <div class="section">
        <h2>Education</h2>
        <div class="job">
            <div class="job-title">Bachelor of Science in Computer Science</div>
            <div class="company">State University | 2015 - 2019</div>
        </div>
    </div>
</body>
</html>
```

### Step 2: Upload and Convert

1. Start the development server: `npm run dev`
2. Open `http://localhost:3000`
3. Upload `test.html`
4. Click "Generate PDF"
5. `Resume.pdf` will download automatically

## Project Structure

```
html-upload-to-pdf-nextjs/
├── app/
│   ├── layout.js           # Root layout
│   ├── page.js              # Main upload page (Client Component)
│   └── api/
│       └── upload-html/
│           └── route.js     # API route for PDF generation
├── next.config.js           # Next.js configuration
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## API Endpoint

### POST `/api/upload-html`

**Request:**
- Content-Type: `multipart/form-data`
- Body: FormData with `file` field containing the HTML file

**Response:**
- Success: PDF binary with headers:
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename=Resume.pdf`
- Error: JSON `{ "error": "error message" }`

## Troubleshooting

### Puppeteer Download Issues

If Puppeteer fails to download Chromium, try:

```bash
npx puppeteer browsers install chrome
```

### Permission Errors on Linux

Ensure the sandbox flags are set correctly (already configured in the API route):

```javascript
puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox']
})
```

### Memory Issues

For large HTML files, you may need to increase Node.js memory:

```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run dev
```

## License

MIT
