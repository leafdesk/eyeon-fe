'use client'

import { useEffect } from 'react'
import { User, FileText } from 'lucide-react'
import Image from 'next/image'
import Header from '@/components/Header'
import MenuItem from './MenuItem'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useAtom } from 'jotai'
import {
  userInfoAtom,
  userInfoLoadingAtom,
  userInfoErrorAtom,
} from '@/atoms/userAtom'
import { toast } from 'sonner'

export default function MyPage() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useAtom(userInfoAtom)
  const [loading, setLoading] = useAtom(userInfoLoadingAtom)
  const [error, setError] = useAtom(userInfoErrorAtom)

  console.log(userInfo)

  // 컴포넌트 마운트 시 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      // 이미 데이터가 있다면 다시 가져오지 않음
      if (userInfo) return

      try {
        setLoading(true)
        setError(null)

        const res = await api.user.getInfo()

        if (res.data.isSuccess) {
          setUserInfo(res.data.data)
        } else {
          setError(res.data.message)
          toast.error('사용자 정보를 가져오는데 실패했습니다.')
        }
      } catch (err) {
        console.error('사용자 정보 조회 에러:', err)
        setError('사용자 정보를 가져오는데 실패했습니다.')
        toast.error('사용자 정보를 가져오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [userInfo, setUserInfo, setLoading, setError])

  const handleMyInfoClick = () => {
    router.push('/my/info')
  }

  const handleMyDocumentsClick = () => {
    router.push('/my/docs')
  }

  return (
    <main className="min-h-screen bg-[#0F1626] text-white">
      {/* Header */}
      <Header left="/main" leftIconType="x" title="마이페이지" right="voice" />

      {/* Profile Section */}
      <div className="flex flex-col items-center mt-6 mb-9">
        {/* Profile Image */}
        <div className="w-[91px] h-[117px] bg-[#2A3441] rounded-lg flex items-center justify-center border border-[#3A4553] mb-3">
          {userInfo?.profileImageUrl ? (
            <Image
              src={userInfo.profileImageUrl}
              alt="Profile"
              width={91}
              height={117}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <User className="w-12 h-12 text-[#8B9AAF]" />
          )}
        </div>

        {/* User Name */}
        <h1 className="text-[28px] font-semibold mb-1">
          {loading ? '로딩 중...' : userInfo?.username || '사용자'}
        </h1>

        {/* Birth Date and Gender - Placeholder */}
        <p className="text-white">
          0000.00.00 <span className="text-[#363C4E]">|</span> 女
        </p>
      </div>

      {/* Menu Options */}
      <div className="px-6 space-y-3">
        {/* My Information */}
        <MenuItem
          icon="/icons/my_person.svg"
          label="내 정보"
          onClick={handleMyInfoClick}
        />

        {/* My Document Templates */}
        <MenuItem
          icon="/icons/my_document.svg"
          label="내 문서 양식"
          onClick={handleMyDocumentsClick}
        />
      </div>

      {/* Logout Button */}
      <section className="w-full fixed bottom-6 flex justify-center">
        <button className="w-20 h-[38px] bg-[#1E2436] font-semibold text-[13px] text-[#EA7C7C] flex items-center justify-center rounded-md">
          로그아웃
        </button>
      </section>
    </main>
  )
}
