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
  )
}
