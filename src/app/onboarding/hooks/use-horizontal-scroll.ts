import { useState, useRef, useEffect, TouchEvent } from 'react'

interface UseHorizontalScrollOptions {
  totalFrames: number
  initialFrame?: number
  scrollBehavior?: ScrollBehavior
}

interface UseHorizontalScrollReturn {
  currentFrame: number
  containerRef: React.RefObject<HTMLDivElement>
  scrollToFrame: (frameIndex: number) => void
  nextFrame: () => void
  prevFrame: () => void
  isFirstFrame: boolean
  isLastFrame: boolean
}

export function useHorizontalScroll({
  totalFrames,
  initialFrame = 0,
  scrollBehavior = 'smooth',
}: UseHorizontalScrollOptions): UseHorizontalScrollReturn {
  const [currentFrame, setCurrentFrame] = useState(initialFrame)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartXRef = useRef<number | null>(null)
  const isInitializedRef = useRef(false)

  const isFirstFrame = currentFrame === 0
  const isLastFrame = currentFrame === totalFrames - 1

  // Handle scroll event
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current

      // If scrollLeft is very small (near 0), force it to the first frame
      if (scrollLeft < 10) {
        setCurrentFrame(0)
        return
      }

      const slideWidth = scrollWidth / totalFrames
      const currentIndex = Math.round(scrollLeft / slideWidth)

      if (
        currentIndex !== currentFrame &&
        currentIndex >= 0 &&
        currentIndex < totalFrames
      ) {
        setCurrentFrame(currentIndex)
      }
    }
  }

  // Touch event handlers for swipe gestures
  const handleTouchStart = (e: TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartXRef.current === null) return

    const touchEndX = e.changedTouches[0].clientX
    const touchDiff = touchStartXRef.current - touchEndX

    // Minimum swipe distance (pixels)
    const MIN_SWIPE_DISTANCE = 50

    if (Math.abs(touchDiff) > MIN_SWIPE_DISTANCE) {
      if (touchDiff > 0 && currentFrame < totalFrames - 1) {
        // Swipe left, go to next frame
        scrollToFrame(currentFrame + 1)
      } else if (touchDiff < 0 && currentFrame > 0) {
        // Swipe right, go to previous frame
        scrollToFrame(currentFrame - 1)
      }
    }

    touchStartXRef.current = null
  }

  // Navigate to a specific frame
  const scrollToFrame = (frameIndex: number) => {
    if (containerRef.current && frameIndex >= 0 && frameIndex < totalFrames) {
      const { scrollWidth } = containerRef.current
      const slideWidth = scrollWidth / totalFrames

      // Special case for first frame - ensure it's at position 0
      if (frameIndex === 0) {
        containerRef.current.scrollTo({
          left: 0,
          behavior: scrollBehavior,
        })
      } else {
        containerRef.current.scrollTo({
          left: slideWidth * frameIndex,
          behavior: scrollBehavior,
        })
      }

      setCurrentFrame(frameIndex)
    }
  }

  // Helper functions for navigation
  const nextFrame = () => {
    if (currentFrame < totalFrames - 1) {
      scrollToFrame(currentFrame + 1)
    }
  }

  const prevFrame = () => {
    if (currentFrame > 0) {
      scrollToFrame(currentFrame - 1)
    }
  }

  // Add scroll event listener
  useEffect(() => {
    const currentContainer = containerRef.current
    if (currentContainer) {
      currentContainer.addEventListener('scroll', handleScroll)
      return () => {
        currentContainer.removeEventListener('scroll', handleScroll)
      }
    }
  }, [totalFrames, currentFrame])

  // Initialize to the first frame
  useEffect(() => {
    if (!isInitializedRef.current && containerRef.current) {
      // Reset scroll position to 0
      containerRef.current.scrollLeft = 0
      setCurrentFrame(0)
      isInitializedRef.current = true
    }
  }, [containerRef.current])

  return {
    currentFrame,
    containerRef,
    scrollToFrame,
    nextFrame,
    prevFrame,
    isFirstFrame,
    isLastFrame,
  }
}
