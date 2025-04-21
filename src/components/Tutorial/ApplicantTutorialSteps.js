// 지원자 페이지용 step 정의 모음
export const APPLICANT_PAGE_STEPS = [
  {
    element: '#applicant-welcome',
    intro: '맞춤형 채용 매칭 서비스 Rezoom에 가입하신 것을 환영합니다.\n',
    position: 'bottom',
  },
  {
    element: '.upload-area',
    intro: '드래그 앤 드롭이나 버튼을 눌러서 이력서를 업로드하면 맞춤형 매칭을 시작할 수 있어요!',
    position: 'left',
  },
  {
    element: '.btn-load-resume',
    intro: '이전에 업로드한 이력서를 여기서 다시 불러올 수 있어요!',
    position: 'bottom',
  },
  {
    element: '.btn-one2one',
    intro: '이력서와 공고를 하나씩 넣어, 이 둘의 1대 1 매칭을 확인할 수 있어요!',
    position: 'bottom',
  },
  {
    element: '.tutorial-credit',
    intro: '여기에서 현재 보유한 크레딧을 확인할 수 있어요. 클릭하면 결제 모달에서 충전할 수 있어요!',
    position: 'bottom',
  },
  {
    element: '.tutorial-payment',
    intro: '결제 내역을 확인할 수 있어요. 얼마나 썼는지, 얼마나 남았는지 쉽게 관리해보세요.',
    position: 'bottom',
  },
  {
    element: '.tutorial-management',
    intro: '이력서를 등록하고 관리할 수 있는 메뉴입니다.',
    position: 'bottom',
  },
];

export const APPLICANT_LIST_STEPS = [
  {
    element: '.list-applicant',
    intro: '이력서 분석이 끝나면, 매칭된 공고들을 확인할 수 있어요!',
    position: 'bottom',
  },
  {
    element: '.card:first-child',
    intro: '카드를 클릭하면 상세 정보를 확인할 수 있어요!',
    position: 'top',
  },
];

export const APPLICANT_DETAIL_STEPS = [
  {
    element: '.chart-donut-wrapper',
    intro: 'AI가 분석한 매칭률을 수치로 보여줍니다. 이 원형 그래프는 총점을 의미해요!',
    position: 'bottom'
  },
  {
    element: '.total-summary',
    intro: 'AI가 분석한 종합 의견이에요. 어떻게 평가되었는지 확인해보세요!',
    position: 'bottom',
  },
  {
    element: '.resume-eval',
    intro: '이력서 항목에 대한 상세한 평가입니다. 기술 스택, 경력 등을 기반으로 평가돼요.',
    position: 'bottom',
  },
  {
    element: '.selfintro-eval',
    intro: '자기소개서에 대한 평가입니다. 논리성과 진정성 등을 고려했어요.',
    position: 'bottom',
  },
  {
    element: '.btn-advisor',
    intro: 'AI가 당신의 이력서를 바탕으로 맞춤 성장 로드맵을 제안해드려요. 회당 500원으로, 신규 회원에게는 2회 무료 이용 가능한 1,000 크레딧이 제공돼요!',
    position: 'bottom',
  },
  {
    element: '.btn-report-download',
    intro: '결과를 PDF로 저장할 수도 있어요!',
    position: 'left',
  },
];
