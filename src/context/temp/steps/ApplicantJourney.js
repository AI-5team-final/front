// 구직자 여정을 위한 튜토리얼 단계 정의
export const APPLICANT_JOURNEY = {
    id: 'applicant-journey',
    title: '구직자 튜토리얼',
    description: 'Rezoom의 구직자 기능을 단계별로 알아보세요!',
    steps: [
        {
            id: 'welcome',
            page: '/',
            element: '#applicant-welcome',
            intro: '맞춤형 채용 매칭 서비스 Rezoom에 오신 것을 환영합니다!',
            position: 'bottom',
            nextPath: '/list'
        },
        {
            id: 'upload-guide',
            page: '/',
            element: '.upload-area',
            intro: '드래그 앤 드롭이나 버튼을 눌러서 이력서를 업로드하면 맞춤형 매칭을 시작할 수 있어요!',
            position: 'left'
        },
        {
            id: 'list-intro',
            page: '/list',
            element: '.list-applicant',
            intro: '이력서 분석이 끝나면, 매칭된 공고들을 확인할 수 있어요!',
            position: 'bottom'
        },
        {
            id: 'card-guide',
            page: '/list',
            element: '.card:first-child',
            intro: '카드를 클릭하면 상세 정보를 확인할 수 있어요!',
            position: 'top',
            nextPath: '/view'
        },
        {
            id: 'view-intro',
            page: '/view',
            element: '.view-container',
            intro: '매칭된 공고의 상세 정보를 확인해보세요!',
            position: 'bottom'
        },
        {
            id: 'match-details',
            page: '/view',
            element: '.match-details',
            intro: 'AI가 분석한 매칭 점수와 상세 평가를 확인할 수 있어요.',
            position: 'right'
        },
        {
            id: 'agent-intro',
            page: '/view',
            element: '.agent-section',
            intro: 'AI 에이전트가 면접 준비와 자기소개서 작성에 도움을 드려요!',
            position: 'right'
        },
        {
            id: 'credit-guide',
            page: '/view',
            element: '.credit-section',
            intro: '크레딧을 사용하여 AI 에이전트의 도움을 받을 수 있어요. 크레딧은 매월 초기화되니 꼭 사용해보세요!',
            position: 'top'
        }
    ]
}; 