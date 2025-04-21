import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useMatch } from '../context/MatchContext';
import ListApplicant from '../components/ListApplicant';
import ListHR from '../components/ListHR';
import LoadingSpinner from '../components/LoadingSpinner';
import fetchClient from '../utils/fetchClient';
import '../styles/List.scss';
import '../styles/LoadingSpinner.scss';
import useAuth from '../hooks/useAuth';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import { handleClientError } from '../utils/handleClientError';

const List = () => {
    const { userInfo } = useAuth();
    const role = userInfo?.role;
    const [loading, setLoading] = useState(false);
    const [ready, setReady] = useState(false);
    const { resumeFile, jobPostFile, setMatchResults, matchResults } = useMatch();
    

    useEffect(() => {
        const fetchMatches = async () => {
            if (!role) return;

            const file = role === 'APPLICANT' ? resumeFile : jobPostFile;
            if (!file) return;

            // 이미 매칭 결과가 있으면 fetch 생략
            if (matchResults?.length > 0) {
                setReady(true);
                return;
            }

            setLoading(true);

            try {
                const formData = new FormData();
                formData.append('file', file);

                const endpoint = role === 'APPLICANT' ? '/pdf/EtoC' : '/pdf/CtoE';
                const response = await fetchClient(endpoint, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error('매칭 요청 실패');

                const data = await response.json();

                // const data = role === "HR" ? [
                //     {
                //         "total_score": 100,
                //         "resume_score": 50,
                //         "selfintro_score": 50,
                //         "opinion1": "민효준 지원자는 요구하는 기술적 역량과 경험을 모두 충족하고 있습니다.",
                //         "summary": "민효준 지원자는 프론트엔드 엔지니어로서 뛰어난 경력과 기술적 역량을 보유하고 있으며, 자기소개서에서도 열정과 목표의식을 잘 표현하고 있습니다. 요구사항을 완벽하게 충족시켜 높은 평가를 받았습니다.",
                //         "eval_resume": "이력서는 매우 훌륭하며, 모든 요구하는 기술 스택에 대해 실무 경험이 있습니다. React, TypeScript, Redux, Styled-components, Webpack 등 다양한 기술을 활용한 경험이 있으며, 협업을 위해 Git을 능숙하게 활용하고 있습니다. 우대사항에 대해서도 UI/UX 설계 관련 경험과 CI/CD 파이프라인 설정 경험을 언급하였으나, 테스트 작성 경험은 기본적인 수준으로 나타났습니다. 그러나 감점 요인은 없고, 이력서 전체적으로 매우 만족스럽습니다.",
                //         "eval_selfintro": "자기소개서는 논리적이고 성실하게 작성되었습니다. 지원자의 여정, 성격의 장단점, 기술 역량 및 입사 후 목표 등을 명확히 전달하고 있으며, 직무에 대한 이해도와 열정이 느껴집니다. 각 항목이 자소서의 포맷에 맞게 잘 설명되었으며, 표현도 자연스럽습니다. 전반적으로 체계적이고 깊이 있는 내용을 담고 있어 높은 점수를 받을 만합니다.",
                //         "name": "민효준",
                //         "uri": "/uploads/file.pdf"
                //     },
                //      {
                //         "total_score": 100,
                //         "resume_score": 50,
                //         "selfintro_score": 50,
                //         "opinion1": "이슬비 지원자는 신입 프론트엔드 개발자로서 뛰어난 역량과 열정을 보여주고 있습니다.",
                //         "summary": "이슬비 지원자는 이력서와 자기소개서에서 요구하는 기술 및 경험이 모두 충족되어 있습니다. 특히 Angular 관련 팀 프로젝트 경험과 개인 프로젝트를 통해 실무 능력을 잘 갖추고 있으며, 자기소개서에서는 자신의 열정과 팀워크, 기술적 스킬을 논리적으로 잘 전달했습니다. 전반적으로 지원자의 역량과 자세가 기업의 요구사항과 잘 맞아떨어져 보입니다.",
                //         "eval_resume": "이력서에서 이슬비 지원자는 Angular, RxJS, NgRx 등 관련 기술 스택을 통한 실무 경험을 자세히 설명하고 있습니다. 소프트웨어 개발 동아리에서의 경험과 개인 프로젝트를 통해 멀티 태스킹 및 문제 해결 능력을 보여주었습니다. 나아가 Git을 활용한 협업 경험도 언급되어 있어, 팀워크 능력이 강조되었습니다. 모든 자격요건을 충족하며, 우대사항 또한 잘 반영되어 있어 이력서는 매우 우수한 평가를 받을 만합니다.",
                //         "eval_selfintro": "자기소개서에서는 이슬비 지원자의 열정과 책임감이 잘 드러났습니다. 특히 기술적으로 깊이 있는 경험과 팀워크에 대한 강조가 인상적입니다. 논리적인 전개와 전문적인 언어 사용으로 자신의 강점과 지원 동기를 효과적으로 전달하였으며, 인상적인 개인 프로젝트 경험과 향후 성장 의지가 잘 표현되어 있습니다. 전반적으로 성실하고 열정적인 모습이 드러나 매우 긍정적으로 평가됩니다.",
                //         "name": "이슬비",
                //         "uri": "/uploads/file.pdf"
                //     },
                //     {
                //         "total_score": 100,
                //         "resume_score": 50,
                //         "selfintro_score": 50,
                //         "opinion1": "홍연구 지원자는 금융 데이터 분석과 AI 기술 역량을 갖춘 우수한 후보입니다.",
                //         "summary": "홍연구 지원자는 AI 및 데이터 분석 분야에서 풍부한 경력을 보유하고 있으며, 특히 대규모 언어 모델(LLM) 콘텐츠를 활용한 프로젝트 경험이 매우 인상적입니다. 이력서는 요구되는 기술 및 자격 요건을 모두 충족하며, 자기소개서 또한 체계적으로 작성되어 지원자의 강점을 잘 표현하고 있습니다. 전반적으로 높은 평가를 받을 만한 매우 적합한 후보라고 할 수 있습니다.",
                //         "eval_resume": "홍연구 지원자의 이력서는 전반적으로 높은 점수를 받을 만합니다. 경력 사항에서는 AI 및 대규모 언어 모델(LLM)을 활용한 금융 데이터 분석 솔루션 개발에 대한 구체적인 성과를 제시하고 있어, 해당 포지션에 적합한 경험을 충분히 보여주고 있습니다. 요구되는 모든 자격 요건에 만족하며, 우대 사항에서도 대부분 충족하고 있어 탁월한 후보로 평가됩니다. 경력이 4년 이상이며 공백기가 없는 점도 긍정적으로 작용합니다.",
                //         "eval_selfintro": "자기소개서는 논리적이고 성실하게 작성되었습니다. 지원자는 자신의 기술적 역량을 구체적으로 설명하며, 과거 경험에서 얻은 교훈과 목표를 명확히 제시하고 있습니다. 표현력 또한 뛰어나며, 글의 흐름이 자연스럽고 일관되어 있습니다. 다소 개인적이고 감성적인 접근이 있긴 하나, 전체적으로 회사에서 요구하는 전문성과 기술적 지식을 잘 드러내고 있습니다. 모든 항목에서 요구하는 기준을 초과하는 뛰어난 자기소개서로 평가할 수 있습니다.",
                //         "name": "홍연구",
                //         "uri": "/uploads/file.pdf"
                //     },
                //     {
                //         "total_score": 85,
                //         "resume_score": 45,
                //         "selfintro_score": 40,
                //         "opinion1": "나무빛 지원자는 이력서에서 필요한 기술과 경험을 충실히 보여주며 지원 동기도 명확했습니다.",
                //         "summary": "지원자는 이력서에서 요구하는 기술과 경험을 효과적으로 나타내고 있으며, AWS와 FastAPI 같은 관련 기술에 대한 경험이 잘 기재되어 있습니다. 자기소개서에서는 자신의 성격적 특성과 기술적 역량을 논리적으로 잘 설명하였으나, 다소 구어체적 표현이 섞이는 경향이 있습니다. 종합적으로 매우 긍정적인 평가가 가능합니다.",
                //         "eval_resume": "이력서는 지원하는 포지션에 적합한 경험과 기술을 잘 보여주고 있습니다. Python과 FastAPI에 대한 학습 경험, AWS를 이용한 서버리스 아키텍처 구축 경험 등이 자격 요건을 충족합니다. 또한, GitHub를 통해 팀 프로젝트 경험을 나열함으로써 협업 능력도 강조하고 있습니다. 다만, 경력이 부족한 신입 직무로서 더 많은 프로젝트 경험을 명시할 수 있었다면 더 좋았을 것입니다.",
                //         "eval_selfintro": "자기소개서에서는 진정성과 동기, 기술적 역량을 잘 드러내고 있습니다. 특히, 각 섹션에서 자신의 경험을 구체적으로 기술하며 지원 동기를 명확히 설명하고 있습니다. 그러나 구어체 표현이 일부 섞여 있어 다소 깔끔하지 못한 인상을 주며, 논리 전개에 약간의 비약이 발생할 가능성이 있어 그 부분에서 감점이 있었습니다. 전반적으로 성실함이 잘 드러납니다.",
                //         "name": "나무빛",
                //         "uri": "/uploads/file.pdf"
                //     },
                //     {
                //         "total_score": 75,
                //         "resume_score": 40,
                //         "selfintro_score": 35,
                //         "opinion1": "홍민수 지원자는 프론트엔드 엔지니어로 적합한 경력과 기술을 보유한 인재입니다.",
                //         "summary": "지원자는 다양한 관련 경험과 실력을 갖추고 있어 프론트엔드 엔지니어 포지션에 적합합니다. 이력서에서는 요구하는 기술 스택과 경력 요건을 충족하고 있으며, 자격 요건에 부합합니다. 그러나 자기소개서는 몇 가지 논리적 비약이 존재하며, 표현이 다소 평범하게 느껴지는 부분이 있습니다. 전반적으로 지원자는 충실한 이력과 자기소개서를 바탕으로 긍정적으로 평가할 만한 후보입니다.",
                //         "eval_resume": "지원자는 HTML, CSS, JavaScript, React.js 및 Next.js에 대한 확실한 이해를 보유하고 있으며, 졸업 프로젝트와 인턴 경험을 통해 실무 능력을 쌓아왔습니다. 이력서에서 요구되는 자격 요건을 완벽히 충족하고, 우대 사항 중 Tailwind CSS 경험도 보유하고 있어 큰 장점을 가지고 있습니다. 공백 기간 없이 관련 경험이 모두 연속적으로 나열되어 있으며, 기술과 경력이 잘 결합되어 있습니다. 다만, Zustand의 경험이 학교 프로젝트 상황에서 한정되는 부분에서 약간의 감점이 있었습니다.",
                //         "eval_selfintro": "자기소개서는 전반적으로 논리적인 구조를 갖추고 있으나 표현력이 부족하고 다소 평범한 느낌을 주는 문장이 있었습니다. 각 경험에 대한 설명이 잘 이루어져 있지만, 구어체 표현이 있어 다소 격식이 떨어지는 인상을 주며 정확한 기술적 용어의 사용이 부족했기 때문에 감점이 있었습니다. 또한, 지원 동기와 입사 후 포부에서는 팀워크과 협업 강조가 나타나지만, 구체적인 계획이나 목표가 부족하여 심도 있는 인상을 주지 못했습니다. 그럼에도 불구하고 기본적으로 성실한 태도를 갖추고 있습니다.",
                //         "name": "홍민수",
                //         "uri": "/uploads/file.pdf"
                //     },
                // ] : [
                //     {
                //         "total_score": 100,
                //         "resume_score": 50,
                //         "selfintro_score": 50,
                //         "opinion1": "홍길동 지원자는 요구하는 기술적 역량과 경험을 모두 충족하고 있습니다.",
                //         "summary": "홍길동 지원자는 프론트엔드 엔지니어로서 뛰어난 경력과 기술적 역량을 보유하고 있으며, 자기소개서에서도 열정과 목표의식을 잘 표현하고 있습니다. 요구사항을 완벽하게 충족시켜 높은 평가를 받았습니다.",
                //         "eval_resume": "이력서는 매우 훌륭하며, 모든 요구하는 기술 스택에 대해 실무 경험이 있습니다. React, TypeScript, Redux, Styled-components, Webpack 등 다양한 기술을 활용한 경험이 있으며, 협업을 위해 Git을 능숙하게 활용하고 있습니다. 우대사항에 대해서도 UI/UX 설계 관련 경험과 CI/CD 파이프라인 설정 경험을 언급하였으나, 테스트 작성 경험은 기본적인 수준으로 나타났습니다. 그러나 감점 요인은 없고, 이력서 전체적으로 매우 만족스럽습니다.",
                //         "eval_selfintro": "자기소개서는 논리적이고 성실하게 작성되었습니다. 지원자의 여정, 성격의 장단점, 기술 역량 및 입사 후 목표 등을 명확히 전달하고 있으며, 직무에 대한 이해도와 열정이 느껴집니다. 각 항목이 자소서의 포맷에 맞게 잘 설명되었으며, 표현도 자연스럽습니다. 전반적으로 체계적이고 깊이 있는 내용을 담고 있어 높은 점수를 받을 만합니다.",
                //         "name": "(주)대단한회사",
                //         "startDay": "25-03-31",
                //         "endDay": "25-05-03",
                //         "uri": "/uploads/file.pdf"
                //     },
                //      {
                //         "total_score": 100,
                //         "resume_score": 50,
                //         "selfintro_score": 50,
                //         "opinion1": "홍길동 지원자는 신입 프론트엔드 개발자로서 뛰어난 역량과 열정을 보여주고 있습니다.",
                //         "summary": "홍길동 지원자는 이력서와 자기소개서에서 요구하는 기술 및 경험이 모두 충족되어 있습니다. 특히 Angular 관련 팀 프로젝트 경험과 개인 프로젝트를 통해 실무 능력을 잘 갖추고 있으며, 자기소개서에서는 자신의 열정과 팀워크, 기술적 스킬을 논리적으로 잘 전달했습니다. 전반적으로 지원자의 역량과 자세가 기업의 요구사항과 잘 맞아떨어져 보입니다.",
                //         "eval_resume": "홍길동에서 이슬비 지원자는 Angular, RxJS, NgRx 등 관련 기술 스택을 통한 실무 경험을 자세히 설명하고 있습니다. 소프트웨어 개발 동아리에서의 경험과 개인 프로젝트를 통해 멀티 태스킹 및 문제 해결 능력을 보여주었습니다. 나아가 Git을 활용한 협업 경험도 언급되어 있어, 팀워크 능력이 강조되었습니다. 모든 자격요건을 충족하며, 우대사항 또한 잘 반영되어 있어 이력서는 매우 우수한 평가를 받을 만합니다.",
                //         "eval_selfintro": "자기소개서에서는 이슬비 지원자의 열정과 책임감이 잘 드러났습니다. 특히 기술적으로 깊이 있는 경험과 팀워크에 대한 강조가 인상적입니다. 논리적인 전개와 전문적인 언어 사용으로 자신의 강점과 지원 동기를 효과적으로 전달하였으며, 인상적인 개인 프로젝트 경험과 향후 성장 의지가 잘 표현되어 있습니다. 전반적으로 성실하고 열정적인 모습이 드러나 매우 긍정적으로 평가됩니다.",
                //         "name": "(주)꿈꾸는사람들",
                //         "startDay": "25-04-02",
                //         "endDay": "25-06-03",
                //         "uri": "/uploads/file.pdf"
                //     },
                //     {
                //         "total_score": 100,
                //         "resume_score": 50,
                //         "selfintro_score": 50,
                //         "opinion1": "홍길동 지원자는 금융 데이터 분석과 AI 기술 역량을 갖춘 우수한 후보입니다.",
                //         "summary": "홍길동 지원자는 AI 및 데이터 분석 분야에서 풍부한 경력을 보유하고 있으며, 특히 대규모 언어 모델(LLM) 콘텐츠를 활용한 프로젝트 경험이 매우 인상적입니다. 이력서는 요구되는 기술 및 자격 요건을 모두 충족하며, 자기소개서 또한 체계적으로 작성되어 지원자의 강점을 잘 표현하고 있습니다. 전반적으로 높은 평가를 받을 만한 매우 적합한 후보라고 할 수 있습니다.",
                //         "eval_resume": "홍길동 지원자의 이력서는 전반적으로 높은 점수를 받을 만합니다. 경력 사항에서는 AI 및 대규모 언어 모델(LLM)을 활용한 금융 데이터 분석 솔루션 개발에 대한 구체적인 성과를 제시하고 있어, 해당 포지션에 적합한 경험을 충분히 보여주고 있습니다. 요구되는 모든 자격 요건에 만족하며, 우대 사항에서도 대부분 충족하고 있어 탁월한 후보로 평가됩니다. 경력이 4년 이상이며 공백기가 없는 점도 긍정적으로 작용합니다.",
                //         "eval_selfintro": "자기소개서는 논리적이고 성실하게 작성되었습니다. 지원자는 자신의 기술적 역량을 구체적으로 설명하며, 과거 경험에서 얻은 교훈과 목표를 명확히 제시하고 있습니다. 표현력 또한 뛰어나며, 글의 흐름이 자연스럽고 일관되어 있습니다. 다소 개인적이고 감성적인 접근이 있긴 하나, 전체적으로 회사에서 요구하는 전문성과 기술적 지식을 잘 드러내고 있습니다. 모든 항목에서 요구하는 기준을 초과하는 뛰어난 자기소개서로 평가할 수 있습니다.",
                //         "name": "코알라기업",
                //          "startDay": "25-04-03",
                //         "endDay": "",
                //         "uri": "/uploads/file.pdf"
                //     },
                //     {
                //         "total_score": 85,
                //         "resume_score": 45,
                //         "selfintro_score": 40,
                //         "opinion1": "홍길동 지원자는 이력서에서 필요한 기술과 경험을 충실히 보여주며 지원 동기도 명확했습니다.",
                //         "summary": "홍길동는 이력서에서 요구하는 기술과 경험을 효과적으로 나타내고 있으며, AWS와 FastAPI 같은 관련 기술에 대한 경험이 잘 기재되어 있습니다. 자기소개서에서는 자신의 성격적 특성과 기술적 역량을 논리적으로 잘 설명하였으나, 다소 구어체적 표현이 섞이는 경향이 있습니다. 종합적으로 매우 긍정적인 평가가 가능합니다.",
                //         "eval_resume": "이력서는 지원하는 포지션에 적합한 경험과 기술을 잘 보여주고 있습니다. Python과 FastAPI에 대한 학습 경험, AWS를 이용한 서버리스 아키텍처 구축 경험 등이 자격 요건을 충족합니다. 또한, GitHub를 통해 팀 프로젝트 경험을 나열함으로써 협업 능력도 강조하고 있습니다. 다만, 경력이 부족한 신입 직무로서 더 많은 프로젝트 경험을 명시할 수 있었다면 더 좋았을 것입니다.",
                //         "eval_selfintro": "자기소개서에서는 진정성과 동기, 기술적 역량을 잘 드러내고 있습니다. 특히, 각 섹션에서 자신의 경험을 구체적으로 기술하며 지원 동기를 명확히 설명하고 있습니다. 그러나 구어체 표현이 일부 섞여 있어 다소 깔끔하지 못한 인상을 주며, 논리 전개에 약간의 비약이 발생할 가능성이 있어 그 부분에서 감점이 있었습니다. 전반적으로 성실함이 잘 드러납니다.",
                //         "name": "비전트립(주)",
                //         "startDay": "25-04-04",
                //         "endDay": "25-05-30",
                //         "uri": "/uploads/file.pdf"
                //     },
                //     {
                //         "total_score": 75,
                //         "resume_score": 40,
                //         "selfintro_score": 35,
                //         "opinion1": "홍길동 지원자는 프론트엔드 엔지니어로 적합한 경력과 기술을 보유한 인재입니다.",
                //         "summary": "지원자는 다양한 관련 경험과 실력을 갖추고 있어 프론트엔드 엔지니어 포지션에 적합합니다. 이력서에서는 요구하는 기술 스택과 경력 요건을 충족하고 있으며, 자격 요건에 부합합니다. 그러나 자기소개서는 몇 가지 논리적 비약이 존재하며, 표현이 다소 평범하게 느껴지는 부분이 있습니다. 전반적으로 지원자는 충실한 이력과 자기소개서를 바탕으로 긍정적으로 평가할 만한 후보입니다.",
                //         "eval_resume": "지원자는 HTML, CSS, JavaScript, React.js 및 Next.js에 대한 확실한 이해를 보유하고 있으며, 졸업 프로젝트와 인턴 경험을 통해 실무 능력을 쌓아왔습니다. 이력서에서 요구되는 자격 요건을 완벽히 충족하고, 우대 사항 중 Tailwind CSS 경험도 보유하고 있어 큰 장점을 가지고 있습니다. 공백 기간 없이 관련 경험이 모두 연속적으로 나열되어 있으며, 기술과 경력이 잘 결합되어 있습니다. 다만, Zustand의 경험이 학교 프로젝트 상황에서 한정되는 부분에서 약간의 감점이 있었습니다.",
                //         "eval_selfintro": "자기소개서는 전반적으로 논리적인 구조를 갖추고 있으나 표현력이 부족하고 다소 평범한 느낌을 주는 문장이 있었습니다. 각 경험에 대한 설명이 잘 이루어져 있지만, 구어체 표현이 있어 다소 격식이 떨어지는 인상을 주며 정확한 기술적 용어의 사용이 부족했기 때문에 감점이 있었습니다. 또한, 지원 동기와 입사 후 포부에서는 팀워크과 협업 강조가 나타나지만, 구체적인 계획이나 목표가 부족하여 심도 있는 인상을 주지 못했습니다. 그럼에도 불구하고 기본적으로 성실한 태도를 갖추고 있습니다.",
                //         "name": "개발세상",
                //         "startDay": "25-03-04",
                //         "endDay": "25-06-30",
                //         "uri": "/uploads/file.pdf"
                //     },
                // ];
                console.log(data);
                setMatchResults(data);
                setReady(true);
            } catch (err) {
                handleClientError({
                    error: err,
                    toastMessage: 'AI 매칭 중 문제가 발생했어요.',
                    contextUrl: role === 'APPLICANT' ? '/pdf/EtoC' : '/pdf/CtoE',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [resumeFile, jobPostFile, role]);


    if (!role) return null;

    const isResumeUploaded = localStorage.getItem('resumeUploaded') === 'true';
    const isJobPostUploaded = localStorage.getItem('jobPostUploaded') === 'true';

    if (
        (role === 'APPLICANT' && !resumeFile && !isResumeUploaded) ||
        (role === 'HR' && !jobPostFile && !isJobPostUploaded)
    ) {
        return <Navigate to="/" />;
    }
    

    return (
        loading ? 
        <Loading text={role === 'APPLICANT'
            ? '이력서를 분석 중입니다'
            : '공고와 이력서를 매칭 중입니다'}/>
        : 
        <main className={`l-list`}>
            {!loading && ready && role === 'APPLICANT' && <ListApplicant />}
            {!loading && ready && role === 'HR' && <ListHR />}
        </main>
    );
};

export default List;