'use client'

import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useState } from 'react'
import CustomToast from '@/components/CustomToast'
import { useRouter, useParams } from 'next/navigation'

export default function ResumeAISummaryPage() {
  const router = useRouter()
  const params = useParams()
  const docId = params.id as string
  const [showToast, setShowToast] = useState(false)

  const handleDownload = () => {
    setShowToast(true)
  }

  return (
    <main className="min-h-screen bg-[#0F1626] text-white flex flex-col">
      <CustomToast
        message="요약본 다운로드 완료!"
        isVisible={showToast}
        duration={1500}
        onClose={() => setShowToast(false)}
      />

      {/* Header */}
      <Header
        title="AI 문서 요약본"
        left={`/my/docs/resume/${docId}`}
        right="voice"
      />

      {/* Content */}
      <div className="flex-1 px-6 pt-2 pb-6 flex flex-col">
        {/* Document Title */}
        <p className="text-gray-400 mb-6">문서 제목</p>

        {/* Summary Points */}
        <div className="space-y-5 text-sm mb-8">
          {/* Point 1 */}
          <div>
            <p className="font-medium mb-1">1. 개인 정보</p>
            <ul className="text-gray-300 space-y-1">
              <li className="flex">
                <span className="mr-1">•</span>
                <span>이름: 홍길동</span>
              </li>
              <li className="flex">
                <span className="mr-1">•</span>
                <span>생년월일: 0000년 00월 00일</span>
              </li>
              <li className="flex">
                <span className="mr-1">•</span>
                <span>연락처: 010-0000-0000</span>
              </li>
              <li className="flex">
                <span className="mr-1">•</span>
                <span>이메일: abc@example.com</span>
              </li>
            </ul>
          </div>

          {/* Point 2 */}
          <div>
            <p className="font-medium mb-1">2. 학력 사항</p>
            <ul className="text-gray-300 space-y-1">
              <li className="flex">
                <span className="mr-1">•</span>
                <span>최종학력: 대학교 졸업</span>
              </li>
              <li className="flex">
                <span className="mr-1">•</span>
                <span>학교명: OO대학교</span>
              </li>
              <li className="flex">
                <span className="mr-1">•</span>
                <span>전공: 컴퓨터공학</span>
              </li>
              <li className="flex">
                <span className="mr-1">•</span>
                <span>졸업연도: 0000년</span>
              </li>
            </ul>
          </div>

          {/* Point 3 */}
          <div>
            <p className="font-medium mb-1">3. 경력 사항</p>
            <ul className="text-gray-300 space-y-1">
              <li className="flex">
                <span className="mr-1">•</span>
                <span>회사명: 주식회사 OO</span>
              </li>
              <li className="flex">
                <span className="mr-1">•</span>
                <span>근무기간: 0000년 00월 ~ 0000년 00월</span>
              </li>
              <li className="flex">
                <span className="mr-1">•</span>
                <span>담당업무: 웹 서비스 개발</span>
              </li>
            </ul>
          </div>

          {/* Point 4 */}
          <div>
            <p className="font-medium mb-1">4. 자격증 및 어학능력</p>
            <ul className="text-gray-300 space-y-1">
              <li className="flex">
                <span className="mr-1">•</span>
                <span>정보처리기사 (0000년)</span>
              </li>
              <li className="flex">
                <span className="mr-1">•</span>
                <span>TOEIC 000점 (0000년)</span>
              </li>
            </ul>
          </div>

          {/* Point 5 */}
          <div>
            <p className="font-medium mb-1">5. 자기소개</p>
            <ul className="text-gray-300 space-y-1">
              <li className="flex">
                <span className="mr-1">•</span>
                <span>
                  성실하고 책임감 있는 자세로 주어진 업무에 최선을 다하겠습니다.
                </span>
              </li>
              <li className="flex">
                <span className="mr-1">•</span>
                <span>
                  새로운 기술 습득에 적극적이며 지속적인 자기계발을 통해
                  성장하겠습니다.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* blank */}
      <div className="h-[80px]" />

      {/* Bottom Buttons */}
      <section className="fixed bottom-0 px-5 py-3 w-full flex space-x-2">
        <button
          className="bg-[#FFD700] p-4 rounded-md"
          onClick={handleDownload}
        >
          <Download size={20} className="text-black" />
        </button>
        <Button
          className="flex-1 bg-white text-black py-4 rounded-md font-medium"
          onClick={() => router.push(`/my/docs/resume/${docId}`)}
        >
          확인
        </Button>
      </section>
    </main>
  )
}
