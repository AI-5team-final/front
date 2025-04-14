import { createContext, useContext, useState, useEffect } from 'react';

const MatchContext = createContext();

export const MatchProvider = ({ children }) => {
    // localStorage에서 초기 상태 로드
    const [matchResults, setMatchResults] = useState(() => {
        const saved = localStorage.getItem('matchResults');
        return saved ? JSON.parse(saved) : [];
    });
    const [resumeFile, setResumeFile] = useState(null);
    const [jobPostFile, setJobPostFile] = useState(null);

    // localStorage 동기화
    useEffect(() => {
        if (matchResults.length > 0) {
            localStorage.setItem('matchResults', JSON.stringify(matchResults));
        }
    }, [matchResults]);

    // 매칭 결과 초기화
    const clearResults = () => {
        setMatchResults([]);
        localStorage.removeItem('matchResults');
    };

    const value = {
        matchResults,
        setMatchResults,
        clearResults,
        resumeFile,
        setResumeFile,
        jobPostFile,
        setJobPostFile
    };

    return (
        <MatchContext.Provider value={value}>
            {children}
        </MatchContext.Provider>
    );
};

export const useMatch = () => {
    const context = useContext(MatchContext);
    if (!context) {
        throw new Error('useMatch must be used within a MatchProvider');
    }
    return context;
}; 