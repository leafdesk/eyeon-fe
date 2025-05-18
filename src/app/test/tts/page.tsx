'use client'

import { TTSOverlay } from './TTSOverlay'
// import BackupTTS from './backup'
import { TTSPlayer } from './TTSPlayer'

export default function TTSTestPage() {
  const text = '안녕하세요. 음성 합성 테스트입니다.'

  return (
    <div>
      {/* <TTSPlayer text={text} autoPlay={true} /> */}
      <TTSOverlay
        text={text}
        // autoPlay={false}
      />

      {/* <BackupTTS /> */}
    </div>
  )
}
