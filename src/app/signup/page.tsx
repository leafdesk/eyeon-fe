'use client'

import { useState } from 'react'
import Step1UserType from './Step1UserType'
import Step2IdCapture from './Step2IdCapture'
import CameraCapture from './CameraCapture'
import Step3Form from './Step3Form'
import Step4Complete from './Step4Complete'

type UserType = 'regular' | 'visuallyImpaired' | null

interface SignupState {
  userType: UserType
  voiceGuidance: boolean
  idImage?: File
  formData?: {
    name: string
    email: string
    // ... 추가 필드
  }
}

export default function SignupScreen() {
  // const [userType, setUserType] = useState<string | null>(null)
  // const [voiceGuidance, setVoiceGuidance] = useState(true)

  const [step, setStep] = useState(1)
  const [signupState, setSignupState] = useState<SignupState>({
    userType: null,
    voiceGuidance: true,
  })
  const [isCapturing, setIsCapturing] = useState(false)

  const goToPrevStep = () => setStep((prev) => prev - 1)
  const goToNextStep = () => setStep((prev) => prev + 1)

  return (
    <>
      {step === 1 && (
        <Step1UserType
          state={signupState}
          setState={setSignupState}
          onNext={goToNextStep}
        />
      )}
      {step === 2 && !isCapturing && (
        <Step2IdCapture
          state={signupState}
          setState={setSignupState}
          onPrev={goToPrevStep}
          onNext={goToNextStep}
          onStartCapture={() => setIsCapturing(true)}
        />
      )}
      {step === 2 && isCapturing && (
        <CameraCapture
          onNext={goToNextStep}
          onCancel={() => setIsCapturing(false)}
          onCapture={(file) => {
            setSignupState((s) => ({ ...s, idImage: file }))
            setIsCapturing(false)
            goToNextStep()
          }}
        />
      )}
      {step === 3 && (
        <Step3Form
          state={signupState}
          setState={setSignupState}
          onPrev={goToPrevStep}
          onNext={goToNextStep}
        />
      )}
      {step === 4 && <Step4Complete onPrev={goToPrevStep} />}
    </>
    // <main className="flex flex-col min-h-screen bg-[#0F1626] text-white">
    //   {/* Header */}
    //   <section className="w-full fixed top-0 flex items-center justify-between h-[56px] px-5">
    //     <div className="w-6 h-6" />
    //     <h1 className="font-semibold text-[20px]">회원가입</h1>
    //     <button className="">
    //       <X size={24} />
    //     </button>
    //   </section>

    //   {/* blank */}
    //   <div className="h-[56px]" />

    //   {/* Welcome text */}
    //   <div className="flex flex-col gap-1 px-5 mb-8 pt-8">
    //     <p className="text-[#ABABAB] text-sm">
    //       EyeOn(아이온)에 오신 것을 환영해요!
    //     </p>
    //     <h2 className="text-[24px] text-white font-normal">
    //       어떤 사용자로 가입하실
    //       <br />
    //       예정이신가요?
    //     </h2>
    //   </div>

    //   {/* User type selection */}
    //   <div className="flex gap-3 px-5 mb-3">
    //     <button
    //       className={`flex-1 h-[234px] rounded-[24px] gap-9 flex flex-col items-center justify-center ${
    //         userType === 'regular'
    //           ? 'ring-3 ring-white bg-white/20'
    //           : 'bg-[#1E2436]'
    //       }`}
    //       onClick={() => setUserType('regular')}
    //     >
    //       <Image
    //         src={
    //           userType === 'regular'
    //             ? '/icons/signup_sun_selected.svg'
    //             : '/icons/signup_sun.svg'
    //         }
    //         alt="sun"
    //         width={60}
    //         height={60}
    //       />
    //       <span className="font-semibold text-base">일반인</span>
    //     </button>

    //     <button
    //       className={`flex-1 h-[234px] rounded-[24px] gap-9 flex flex-col items-center justify-center ${
    //         userType === 'visuallyImpaired'
    //           ? 'ring-3 ring-white bg-white/20'
    //           : 'bg-[#1E2436]'
    //       }`}
    //       onClick={() => setUserType('visuallyImpaired')}
    //     >
    //       <Image
    //         src={
    //           userType === 'visuallyImpaired'
    //             ? '/icons/signup_moon_selected.svg'
    //             : '/icons/signup_moon.svg'
    //         }
    //         alt="moon"
    //         width={60}
    //         height={60}
    //       />
    //       <span className="font-semibold text-base">시각 장애인</span>
    //     </button>
    //   </div>

    //   {/* Voice guidance toggle */}
    //   <section className="px-5">
    //     <div className="bg-[#1E2436] rounded-[16px] py-3 px-4 flex items-start">
    //       <Image
    //         src="/icons/signup_speaker.svg"
    //         alt="speaker"
    //         width={24}
    //         height={24}
    //         className="mr-1"
    //       />

    //       <div className="flex flex-col gap-2">
    //         <span className="text-white text-base font-semibold">
    //           음성 안내
    //         </span>
    //         <p className="text-[11px] text-[#9B9B9B]">
    //           미디어페이지에서 음성 안내를 변경할 수 있습니다.
    //         </p>
    //       </div>

    //       <Switch
    //         checked={voiceGuidance}
    //         onCheckedChange={setVoiceGuidance}
    //         className="data-[state=checked]:bg-[#E4BD00] data-[state=checked]:border-[#E4BD00] ml-auto"
    //       />
    //     </div>
    //   </section>

    //   {/* Next button */}
    //   <section className="fixed bottom-0 px-5 py-3 w-full">
    //     <Button disabled={userType == null}>다음</Button>
    //   </section>
    // </main>
  )
}
