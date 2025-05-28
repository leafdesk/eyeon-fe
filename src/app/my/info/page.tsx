'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAtom } from 'jotai'
import {
  userInfoAtom,
  userInfoLoadingAtom,
  userInfoErrorAtom,
} from '@/atoms/userAtom'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { UserModifyRequest } from '@/lib/api-types'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { User } from 'lucide-react'

// 카카오 우편번호 서비스 타입 정의
declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: {
          address: string
          roadAddress: string
          jibunAddress: string
          zonecode: string
        }) => void
        theme?: {
          bgColor?: string
          searchBgColor?: string
          contentBgColor?: string
          pageBgColor?: string
          textColor?: string
          queryTextColor?: string
        }
      }) => {
        open: () => void
      }
    }
  }
}

export default function MyInfoPage() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useAtom(userInfoAtom)
  const [loading, setLoading] = useAtom(userInfoLoadingAtom)
  const [error, setError] = useAtom(userInfoErrorAtom)

  // 로컬 상태 (수정 값)
  const [address, setAddress] = useState('')
  const [detailAddress, setDetailAddress] = useState('')
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [profileFile, setProfileFile] = useState<File | null>(null)

  // 파일 입력 참조
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 사용자 정보 가져오기
  const fetchUserInfo = async () => {
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

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfileFile(file)

      // 파일 미리보기 URL 생성
      const fileUrl = URL.createObjectURL(file)
      setProfileImage(fileUrl)

      toast.success('프로필 이미지가 선택되었습니다.')
    }
  }

  // 파일 선택 다이얼로그 열기
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // 주소 검색 핸들러
  const handleAddressSearch = () => {
    if (typeof window !== 'undefined' && window.daum) {
      new window.daum.Postcode({
        oncomplete: function (data) {
          // 도로명주소 우선, 없으면 지번주소 사용
          const address = data.roadAddress || data.jibunAddress

          setAddress(address)
        },
        theme: {
          bgColor: '#1e2738',
          searchBgColor: '#0F1626',
          contentBgColor: '#1e2738',
          pageBgColor: '#0F1626',
          textColor: '#FFFFFF',
          queryTextColor: '#FFFFFF',
        },
      }).open()
    } else {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
    }
  }

  // 컴포넌트 마운트 시 사용자 정보 설정
  useEffect(() => {
    // 사용자 정보가 없다면 API 호출
    if (!userInfo && !loading) {
      fetchUserInfo()
      return
    }

    if (userInfo) {
      // 주소 파싱 (상세 주소가 있다면 분리)
      const fullAddress = userInfo.address || ''
      const addressParts = fullAddress.split(',')

      if (addressParts.length > 1) {
        setAddress(addressParts[0].trim())
        setDetailAddress(addressParts.slice(1).join(',').trim())
      } else {
        setAddress(fullAddress)
        setDetailAddress('')
      }

      // 기타 정보 설정
      setName(userInfo.username || '')
      setPhoneNumber(userInfo.phoneNumber || '')
    }
  }, [userInfo, loading])

  // 메모리 정리
  useEffect(() => {
    return () => {
      // 이미지 객체 URL 해제
      if (profileImage) {
        URL.revokeObjectURL(profileImage)
      }
    }
  }, [profileImage])

  // 로딩 중이거나 사용자 정보가 없을 때는 헤더만 표시
  if (loading || !userInfo) {
    return (
      <main className="min-h-screen bg-[#0F1626] text-white">
        <Header left="/my" title="내 정보" right="voice" />
      </main>
    )
  }

  // 에러 발생 시 표시
  if (error && !userInfo) {
    return (
      <main className="min-h-screen bg-[#0F1626] text-white">
        <Header left="/my" title="내 정보" right="voice" />
        <div className="flex flex-col justify-center items-center h-[80vh] px-5 text-center">
          <p className="mb-4">사용자 정보를 불러오는데 실패했습니다.</p>
          <Button onClick={fetchUserInfo}>다시 시도</Button>
        </div>
      </main>
    )
  }

  // 정보 저장 처리
  const handleSave = async () => {
    try {
      setIsSaving(true)

      // 주소 합치기 (상세 주소가 있는 경우)
      const fullAddress = detailAddress
        ? `${address}, ${detailAddress}`
        : address

      const userData: UserModifyRequest = {
        address: fullAddress,
        name: name,
        phoneNumber: phoneNumber,
      }

      // 프로필 이미지가 변경된 경우
      if (profileFile) {
        // TODO: 실제 파일 업로드 API 구현 필요
        // const uploadResult = await api.user.uploadProfileImage(profileFile)
        // userData.profileImageUrl = uploadResult.data.imageUrl

        // 현재는 파일 업로드 API가 없으므로 기존 이미지 유지
        console.log('프로필 이미지 업로드 기능은 추후 구현 예정')
      }

      const res = await api.user.modifyInfo(userData)

      if (res.data.isSuccess) {
        // 성공 시 사용자 정보 다시 가져오기
        const updatedInfo = await api.user.getInfo()
        if (updatedInfo.data.isSuccess) {
          setUserInfo(updatedInfo.data.data)
          toast.success('정보가 성공적으로 저장되었습니다.')
        }
      } else {
        toast.error(res.data.message || '정보 저장에 실패했습니다.')
      }
    } catch (err) {
      console.error('정보 저장 에러:', err)
      toast.error('정보 저장 중 오류가 발생했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  // 주민번호 마스킹 함수 (앞자리 6자리 전부, 뒷자리 첫 1자리만 표시)
  const maskResidentNumber = (residentNumber?: string) => {
    if (!residentNumber) return '000000-1******'

    // 주민번호 형식: 123456-1234567
    const cleaned = residentNumber.replace(/[^0-9]/g, '')
    if (cleaned.length !== 13) return '000000-1******'

    const front = cleaned.substring(0, 6) // 앞자리 6자리 전부
    const back = cleaned.substring(6) // 뒷자리 7자리

    return `${front}-${back.charAt(0)}******` // 앞자리 전부 + 뒷자리 첫 1자리
  }

  return (
    <main className="min-h-screen bg-[#0F1626] text-white">
      {/* 카카오 우편번호 서비스 스크립트 */}
      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
      />

      {/* Header */}
      <Header left="/my" title="내 정보" right="voice" />

      {/* Profile Section */}
      <div className="flex flex-col items-center mt-6 mb-6">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Profile Image - 마이페이지와 동일한 스타일 */}
        <div className="w-[91px] h-[117px] bg-[#2A3441] rounded-lg flex items-center justify-center border border-[#3A4553] mb-3">
          {profileImage || userInfo?.profileImageUrl ? (
            <Image
              src={profileImage || userInfo.profileImageUrl}
              alt="Profile"
              width={91}
              height={117}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <User className="w-12 h-12 text-[#8B9AAF]" />
          )}
        </div>

        {/* 사진 변경 버튼 */}
        <button
          className="px-6 bg-[#363C4E] rounded-md text-sm h-[42px] font-semibold text-[15px]"
          onClick={handleUploadClick}
        >
          사진 변경
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col px-5 space-y-5">
        {/* Address */}
        <div className="">
          <label className="block text-sm mb-2">주소</label>
          <div className="relative mb-3">
            <Input
              type="text"
              placeholder="주소를 검색해 입력해 주세요"
              className="w-full bg-[#1e2738] text-gray-300 p-4 pr-20 rounded-md"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              readOnly
            />
            <button
              type="button"
              onClick={handleAddressSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#FFD700] text-[#0F1626] px-2 h-6 rounded-[4px] font-semibold text-xs"
            >
              주소 검색
            </button>
          </div>
          <Input
            type="text"
            placeholder="상세 주소를 입력해 주세요"
            className="w-full bg-[#1e2738] text-gray-300 p-4 rounded-md"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
          />
        </div>

        {/* Name */}
        <div className="">
          <label className="block text-sm mb-2">성명</label>
          <Input
            type="text"
            placeholder="홍길동"
            className="w-full bg-[#1e2738] text-white p-4 rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Phone Number */}
        <div className="">
          <label className="block text-sm mb-2">휴대폰 번호</label>
          <Input
            type="tel"
            placeholder="010-0000-0000"
            className="w-full bg-[#1e2738] text-white p-4 rounded-md"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        {/* 주민등록번호 - 읽기 전용 */}
        <div className="">
          <label className="block text-sm mb-2">주민등록번호</label>
          <Input
            type="text"
            placeholder="주민등록번호"
            className="w-full bg-[#2A3441] text-gray-500 p-4 rounded-md cursor-not-allowed"
            value={maskResidentNumber(userInfo.residentNumber)}
            disabled
          />
        </div>

        {/* 이메일 - 읽기 전용 */}
        <div className="">
          <label className="block text-sm mb-2">이메일</label>
          <Input
            type="email"
            placeholder="abc1234@naver.com"
            className="w-full bg-[#2A3441] text-gray-500 p-4 rounded-md cursor-not-allowed"
            value={userInfo.email || ''}
            disabled
          />
        </div>
      </div>

      {/* blank */}
      <div className="h-[100px]" />

      {/* Save Button */}
      <section className="fixed bottom-0 px-5 py-3 w-full">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? '저장 중...' : '저장하기'}
        </Button>
      </section>
    </main>
  )
}
