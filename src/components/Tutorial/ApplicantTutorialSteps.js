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
    element: '.total-summary',
    intro: 'AI가 분석한 종합 의견이에요. 어떻게 평가되었는지 확인해보세요!',
    position: 'bottom',
  },
  {
    element: '.card-match-rate',
    intro: '이력서와 공고가 얼마나 잘 맞는지를 수치로 보여줍니다.',
    position: 'top',
  },
  {
    element: '.btn-report-download',
    intro: '결과를 PDF로 저장할 수도 있어요!',
    position: 'left',
  },
];