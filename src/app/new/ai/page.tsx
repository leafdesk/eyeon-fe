'use client'

import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useState } from 'react'
import CustomToast from '@/components/CustomToast'
import { useRouter } from 'next/navigation'

export default function AISummaryPage() {
  const router = useRouter()
  const [showToast, setShowToast] = useState(false)

  const handleDownload = () => {
    setShowToast(true)
  }

  return (
    <main className="min-h-screen bg-[#0e1525] text-white flex flex-col">
      <CustomToast
        message="요약본 다운로드 완료!"
        isVisible={showToast}
        duration={1500}
        onClose={() => setShowToast(false)}
      />

      {/* Header */}
      <Header title="AI 문서 요약본" left="/new/complete" right="voice" />

      {/* Content */}
      <div className="flex-1 px-6 pt-2 pb-6 flex flex-col">
        {/* Document Title */}
        <p className="text-gray-400 mb-6">문서 제목</p>

        {/* Summary Points */}
        <div className="space-y-5 text-sm mb-8">
          {/* Point 1 */}
          <div>
            <p className="font-medium mb-1">1. 계약 당사자</p>
            <ul className="text-gray-300 space-y-1">
              <li className="flex">
                <span className="mr-1">•</span>
                <span>채용권자: 기상청 권기남 장</span>
              </li>
              <li className="flex">
                <span className="mr-1">•</span>
                <span>근로자: 양배영</span>
              </li>
            </ul>
          </div>

          {/* Point 2 */}
          <div>
            <p className="font-medium mb-1">2. 근로계약 기간</p>
            <ul className="text-gray-300 space-y-1">
              <li className="flex">
                <span className="mr-1">•</span>
                <span>계약 시작일 ~ 종료일 명시</span>
              </li>
              <li className="flex">
                <span className="mr-1">•</span>
                <span>
                  수습기간: 최대 3개월 이내 가능하며, 평가 후 본 채용 여부 결정
                </span>
              </li>
            </ul>
          </div>

          {/* Point 3 */}
          <div>
            <p className="font-medium mb-1">3. 근무장소 및 업무</p>
            <ul className="text-gray-300 space-y-1">
              <li className="flex">
                <span className="mr-1">•</span>
                <span>장소: 서울지방기상청</span>
              </li>
              <li className="flex">
                <span className="mr-1">•</span>
                <span>직종 및 업무내용: 명시</span>
              </li>
              <li className="flex">
                <span className="mr-1">•</span>
                <span>필요시, 근무 장소 및 내용 변경 가능</span>
              </li>
            </ul>
          </div>

          {/* Point 4 */}
          <div>
            <p className="font-medium mb-1">4. 보수(임금)</p>
            <ul className="text-gray-300 space-y-1">
              <li className="flex">
                <span className="mr-1">•</span>
                <span>월급 또는 일급 형태</span>
              </li>
              <li className="flex">
                <span className="mr-1">•</span>
                <span>임금 구성 항목:</span>
              </li>
              <li className="flex pl-4">
                <span>
                  기본급여, 연장/야간/휴일근로수당, 식비, 복지포인트, 면접휴가비
                  등
                </span>
              </li>
              <li className="flex">
                <span className="mr-1">•</span>
                <span>지급일: 매월 말일 (또 : 공휴일인면 전일 지급)</span>
              </li>
              <li className="flex">
                <span className="mr-1">•</span>
                <span>결근/병역 시 감액</span>
              </li>
            </ul>
          </div>

          {/* Point 5 */}
          <div>
            <p className="font-medium mb-1">5. 근로시간 및 휴게시간</p>
            <ul className="text-gray-300 space-y-1">
              <li className="flex">
                <span className="mr-1">•</span>
                <span>주 월요일~금요일, 09시~18시 (휴게시간 포함)</span>
              </li>
              <li className="flex">
                <span className="mr-1">•</span>
                <span>소정근로시간: 1일 8시간, 주 40시간</span>
              </li>
              <li className="flex">
                <span className="mr-1">•</span>
                <span>근무시간 조정 가능, 교대근무 가능</span>
              </li>
            </ul>
          </div>

          {/* Point 6 */}
          <div>
            <p className="font-medium mb-1">6. 휴일 및 휴가</p>
            <ul className="text-gray-300 space-y-1">
              <li className="flex">
                <span className="mr-1">•</span>
                <span>유급휴일: 주휴일, 근로자의 날, 공휴일</span>
              </li>
              <li className="flex">
                <span className="mr-1">•</span>
                <span>연차, 생리휴가 등은 법규 규정에 따름</span>
              </li>
              <li className="flex">
                <span className="mr-1">•</span>
                <span>근무시간 조정 가능, 교대근무 가능</span>
              </li>
            </ul>
          </div>

          {/* Point 7 */}
          <div>
            <p className="font-medium mb-1">7. 비밀유지의무</p>
            <ul className="text-gray-300 space-y-1">
              <li className="flex">
                <span className="mr-1">•</span>
                <span>업무 중 알게 된 비밀 누설 금지</span>
              </li>
              <li className="flex">
                <span className="mr-1">•</span>
                <span>위반 시 민 · 형사 책임</span>
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
          className="bg-[#ffd426] p-4 rounded-md"
          onClick={handleDownload}
        >
          <Download size={20} className="text-black" />
        </button>
        <Button
          className="flex-1 bg-white text-black py-4 rounded-md font-medium"
          onClick={() => router.push('/new/complete')}
        >
          확인
        </Button>
      </section>
    </main>
  )
}
