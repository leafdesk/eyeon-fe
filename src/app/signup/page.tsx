'use client'

import { useState } from 'react'
import Step1UserType from './Step1UserType'
import Step2IdCapture from './Step2IdCapture'
import CameraCapture from './CameraCapture'
import Step3Form from './Step3Form'
import Step3FormAuto from './Step3FormAuto'
import Step4Complete from './Step4Complete'

type UserType = 'regular' | 'visuallyImpaired' | null

interface SignupState {
  userType: UserType
  idImage?: File
  formData?: {
    name: string
    email: string
    // ... 추가 필드
  }
  usedCamera?: boolean // 카메라 사용 여부 추가
}

export default function SignupScreen() {
  // const [userType, setUserType] = useState<string | null>(null)
  // const [voiceGuidance, setVoiceGuidance] = useState(true)

  const [step, setStep] = useState(1)
  const [signupState, setSignupState] = useState<SignupState>({
    userType: null,
    usedCamera: false,
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
          onNext={() => {
            // 직접 입력 선택 시 usedCamera를 false로 설정
            setSignupState((s) => ({ ...s, usedCamera: false }))
            goToNextStep()
          }}
          onStartCapture={() => setIsCapturing(true)}
        />
      )}
      {step === 2 && isCapturing && (
        <CameraCapture
          onNext={() => {
            // 카메라에서 직접 입력 선택 시
            setSignupState((s) => ({ ...s, usedCamera: false }))
            setIsCapturing(false)
            goToNextStep()
          }}
          onCancel={() => setIsCapturing(false)}
          onCapture={(file) => {
            // 카메라 캡처 완료 시 usedCamera를 true로 설정
            setSignupState((s) => ({ ...s, idImage: file, usedCamera: true }))
            setIsCapturing(false)
            goToNextStep()
          }}
        />
      )}
      {step === 3 && !signupState.usedCamera && (
        <Step3Form
          state={signupState}
          setState={setSignupState}
          onPrev={goToPrevStep}
          onNext={goToNextStep}
        />
      )}
      {step === 3 && signupState.usedCamera && (
        <Step3FormAuto
          state={signupState}
          setState={setSignupState}
          onPrev={goToPrevStep}
          onNext={goToNextStep}
          onRetakePhoto={() => {
            // 다시 촬영하기 - step 2로 돌아가고 카메라 캡처 모드로 설정
            setStep(2)
            setIsCapturing(true)
          }}
        />
      )}
      {step === 4 && <Step4Complete onPrev={goToPrevStep} />}
    </>
  )
}
