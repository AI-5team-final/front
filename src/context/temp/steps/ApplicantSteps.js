// 구직자용 튜토리얼 단계 정의
export const APPLICANT_MAIN_STEPS = [
    {
        id: 'welcome',
        element: '#applicant-welcome',
        intro: '맞춤형 채용 매칭 서비스 Rezoom에 가입하신 것을 환영합니다.',
        position: 'bottom',
        nextPath: '/list' // 다음 단계로 이동할 경로
    },
    {
        id: 'upload',
        element: '.upload-area',
        intro: '드래그 앤 드롭이나 버튼을 눌러서 이력서를 업로드하면 맞춤형 매칭을 시작할 수 있어요!',
        position: 'left'
    }
];

export const APPLICANT_LIST_STEPS = [
    {
        id: 'list-intro',
        element: '.list-applicant',
        intro: '이력서 분석이 끝나면, 매칭된 공고들을 확인할 수 있어요!',
        position: 'bottom'
    },
    {
        id: 'card-detail',
        element: '.card:first-child',
        intro: '카드를 클릭하면 상세 정보를 확인할 수 있어요!',
        position: 'top',
        nextPath: '/view' // 다음 단계로 이동할 경로
    }
];

export const APPLICANT_VIEW_STEPS = [
    {
        id: 'view-intro',
        element: '.view-container',
        intro: '매칭된 공고의 상세 정보를 확인해보세요!',
        position: 'bottom'
    },
    {
        id: 'match-details',
        element: '.match-details',
        intro: 'AI가 분석한 매칭 점수와 상세 평가를 확인할 수 있어요.',
        position: 'right'
    }
]; 