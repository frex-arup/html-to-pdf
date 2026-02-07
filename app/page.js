'use client';

import { useState, useRef } from 'react';

export default function Home() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type === 'text/html' || selectedFile.name.endsWith('.html')) {
                setFile(selectedFile);
                setError('');
                setSuccess('');
            } else {
                setFile(null);
                setError('Please select a valid HTML file.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setError('Please select an HTML file first.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload-html', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to generate PDF');
            }

            // Get the PDF blob
            const blob = await response.blob();

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Resume.pdf';
            document.body.appendChild(a);
            a.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setSuccess('PDF generated and downloaded successfully!');
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            setError(err.message || 'An error occurred while generating the PDF.');
        } finally {
            setLoading(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            if (droppedFile.type === 'text/html' || droppedFile.name.endsWith('.html')) {
                setFile(droppedFile);
                setError('');
                setSuccess('');
            } else {
                setError('Please drop a valid HTML file.');
            }
        }
    };

    return (
        <main style={styles.main}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <div style={styles.iconWrapper}>
                        <svg style={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 18V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9 15L12 12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1 style={styles.title}>HTML to PDF Converter</h1>
                    <p style={styles.subtitle}>Upload your HTML file and convert it to a selectable-text PDF</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div
                        style={{
                            ...styles.dropZone,
                            ...(file ? styles.dropZoneActive : {}),
                        }}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".html"
                            onChange={handleFileChange}
                            style={styles.fileInput}
                        />

                        {file ? (
                            <div style={styles.fileInfo}>
                                <svg style={styles.fileIcon} viewBox="0 0 24 24" fill="none">
                                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M14 2V8H20" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span style={styles.fileName}>{file.name}</span>
                                <span style={styles.fileSize}>({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                        ) : (
                            <div style={styles.uploadPrompt}>
                                <svg style={styles.uploadIcon} viewBox="0 0 24 24" fill="none">
                                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p style={styles.uploadText}>
                                    <span style={styles.uploadHighlight}>Click to upload</span> or drag and drop
                                </p>
                                <p style={styles.uploadHint}>HTML files only</p>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!file || loading}
                        style={{
                            ...styles.button,
                            ...((!file || loading) ? styles.buttonDisabled : {}),
                        }}
                    >
                        {loading ? (
                            <span style={styles.loadingWrapper}>
                                <span style={styles.spinner}></span>
                                Generating PDF...
                            </span>
                        ) : (
                            'Generate PDF'
                        )}
                    </button>
                </form>

                {error && (
                    <div style={styles.errorMessage}>
                        <svg style={styles.messageIcon} viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        {error}
                    </div>
                )}

                {success && (
                    <div style={styles.successMessage}>
                        <svg style={styles.messageIcon} viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {success}
                    </div>
                )}

                <div style={styles.features}>
                    <div style={styles.feature}>
                        <div style={styles.featureIcon}>📄</div>
                        <div>
                            <h3 style={styles.featureTitle}>Self-contained HTML</h3>
                            <p style={styles.featureDesc}>Supports HTML with inline CSS and JavaScript</p>
                        </div>
                    </div>
                    <div style={styles.feature}>
                        <div style={styles.featureIcon}>🔤</div>
                        <div>
                            <h3 style={styles.featureTitle}>Selectable Text</h3>
                            <p style={styles.featureDesc}>Generated PDFs have selectable, searchable text</p>
                        </div>
                    </div>
                    <div style={styles.feature}>
                        <div style={styles.featureIcon}>⚡</div>
                        <div>
                            <h3 style={styles.featureTitle}>Fast Processing</h3>
                            <p style={styles.featureDesc}>Powered by Puppeteer for reliable conversion</p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          min-height: 100vh;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
        </main>
    );
}

const styles = {
    main: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
    },
    container: {
        width: '100%',
        maxWidth: '520px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '40px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '32px',
    },
    iconWrapper: {
        width: '64px',
        height: '64px',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
        boxShadow: '0 10px 30px -10px rgba(99, 102, 241, 0.5)',
    },
    icon: {
        width: '32px',
        height: '32px',
        color: 'white',
    },
    title: {
        fontSize: '28px',
        fontWeight: '700',
        color: 'white',
        marginBottom: '8px',
        letterSpacing: '-0.5px',
    },
    subtitle: {
        fontSize: '15px',
        color: 'rgba(255, 255, 255, 0.6)',
        lineHeight: '1.5',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    dropZone: {
        border: '2px dashed rgba(255, 255, 255, 0.2)',
        borderRadius: '16px',
        padding: '40px 24px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        background: 'rgba(255, 255, 255, 0.02)',
    },
    dropZoneActive: {
        border: '2px dashed #10b981',
        background: 'rgba(16, 185, 129, 0.1)',
    },
    fileInput: {
        display: 'none',
    },
    uploadPrompt: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
    },
    uploadIcon: {
        width: '48px',
        height: '48px',
        color: 'rgba(255, 255, 255, 0.4)',
    },
    uploadText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '15px',
    },
    uploadHighlight: {
        color: '#818cf8',
        fontWeight: '600',
    },
    uploadHint: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: '13px',
    },
    fileInfo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        flexWrap: 'wrap',
    },
    fileIcon: {
        width: '24px',
        height: '24px',
    },
    fileName: {
        color: '#10b981',
        fontWeight: '600',
        fontSize: '15px',
    },
    fileSize: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '13px',
    },
    button: {
        width: '100%',
        padding: '16px 24px',
        fontSize: '16px',
        fontWeight: '600',
        color: 'white',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 10px 30px -10px rgba(99, 102, 241, 0.5)',
    },
    buttonDisabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
        boxShadow: 'none',
    },
    loadingWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
    },
    spinner: {
        width: '20px',
        height: '20px',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        borderTopColor: 'white',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    },
    errorMessage: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '14px 18px',
        background: 'rgba(239, 68, 68, 0.15)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '12px',
        color: '#fca5a5',
        fontSize: '14px',
        marginTop: '8px',
    },
    successMessage: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '14px 18px',
        background: 'rgba(16, 185, 129, 0.15)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '12px',
        color: '#6ee7b7',
        fontSize: '14px',
        marginTop: '8px',
    },
    messageIcon: {
        width: '20px',
        height: '20px',
        flexShrink: 0,
    },
    features: {
        marginTop: '32px',
        paddingTop: '24px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    feature: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
    },
    featureIcon: {
        fontSize: '24px',
        width: '40px',
        height: '40px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    featureTitle: {
        color: 'white',
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '4px',
    },
    featureDesc: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '13px',
        lineHeight: '1.4',
    },
};
