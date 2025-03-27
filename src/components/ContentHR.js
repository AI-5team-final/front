import React from 'react';

const styles = {
    container: {
        padding: '60px 0',
        minHeight: '100vh',
    },
    inner: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
    },
    hero: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '60px',
        gap: '40px',
    },
    heroContent: {
        flex: '1',
    },
    heroTitle: {
        fontSize: '2.5rem',
        color: '#1A237E',
        marginBottom: '20px',
        lineHeight: '1.4',
    },
    heroSubtitle: {
        fontSize: '1.1rem',
        color: '#455A64',
    },
};

const ContentHR = () => {
    return (
        <main style={styles.container}>
            <div style={styles.inner}>
                <section style={styles.hero}>
                    <div style={styles.heroContent}>
                        <h1 style={styles.heroTitle}>
                            AI 매칭으로 인재 채용까지<br />
                            한 걸음 더
                        </h1>
                        <p style={styles.heroSubtitle}>
                            우리 회사에 맞는 인재를 정확히 추천해드려요.
                        </p>
                    </div>
                </section>
                
                {/* HR 전용 컨텐츠를 여기에 추가할 수 있습니다 */}
            </div>
        </main>
    );
}

export default ContentHR; 