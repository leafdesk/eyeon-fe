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

export default function MyInfoPage() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useAtom(userInfoAtom)
  const [loading, setLoading] = useAtom(userInfoLoadingAtom)
  const [error, setError] = useAtom(userInfoErrorAtom)

  // 로컬 상태 (수정 값)
  const [address, setAddress] = useState('')
  const [detailAddress, setDetailAddress] = useState('')
  const [name, setName] = useState('')
  const [residentNumber, setResidentNumber] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
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
      setEmail(userInfo.email || '')
      // 주민등록번호는 보안상 표시하지 않거나 마스킹 처리
      setResidentNumber('******-*******')
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
        ? `${address},${detailAddress}`
        : address

      const userData: UserModifyRequest = {
        address: fullAddress,
      }

      // 프로필 이미지가 변경된 경우, 업로드 예시 (실제로는 서버에 업로드하고 URL을 받아와야 함)
      // 여기서는 디자인 목적으로 placeholder URL 사용
      if (profileFile) {
        // API에 실제 파일 업로드 로직이 필요함
        // 예: const uploadResult = await api.user.uploadProfileImage(profileFile);
        // 그 후 uploadResult.imageUrl을 userData에 설정

        // 임시로 placeholder URL 설정 (실제로는 서버에서 받은 URL 사용)
        userData.profileImageUrl = 'https://via.placeholder.com/200'
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

  return (
    <main className="min-h-screen bg-[#0F1626] text-white">
      {/* Header */}
      <Header left="/my" title="내 정보" right="voice" />

      {/* Profile Section */}
      <div className="flex flex-col items-center my-4">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Profile Image */}
        <div className="w-[91px] h-[117px]">
          <Image
            src={
              profileImage ||
              userInfo.profileImageUrl ||
              '/images/my_profile.png'
            }
            alt="Profile"
            width={91}
            height={117}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 사진 변경 버튼 */}
        <button
          className="px-6 bg-[#363C4E] rounded-md text-sm h-[42px] font-semibold text-[15px] mt-2"
          onClick={handleUploadClick}
        >
          사진 변경
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col pt-4 px-5 space-y-5">
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
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#FFD700] text-[#0F1626] px-2 h-6 rounded-[4px] font-semibold text-xs">
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
            disabled
          />
        </div>

        {/* Resident Registration Number */}
        <div className="">
          <label className="block text-sm mb-2">주민등록번호</label>
          <Input
            type="text"
            placeholder="주민등록번호를 입력해 주세요"
            className="w-full bg-[#1e2738] text-gray-300 p-4 rounded-md"
            value={residentNumber}
            onChange={(e) => setResidentNumber(e.target.value)}
            disabled
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
            disabled
          />
        </div>

        {/* Email */}
        <div className="">
          <label className="block text-sm mb-2">이메일</label>
          <Input
            type="email"
            placeholder="abc1234@naver.com"
            className="w-full bg-[#1e2738] text-white p-4 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled
          />
        </div>
      </div>

      {/* blank */}
      <div className="h-[160px]" />

      {/* Next */}
      <section className="fixed bottom-0 px-5 py-3 w-full">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? '저장 중...' : '저장하기'}
        </Button>
      </section>
    </main>
  )
}
