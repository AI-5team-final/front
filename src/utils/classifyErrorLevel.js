export default function classifyErrorLevel(error) {
    const message = error?.message || (typeof error === 'string' ? error : '');

    if (/ResizeObserver/.test(message)) return 'INFO';
    if (/TypeError|ReferenceError|SyntaxError/.test(message)) return 'CRITICAL';
    if (/NetworkError|Failed to fetch|timeout/.test(message)) return 'WARNING';

    return 'CRITICAL'; // 기본값
}