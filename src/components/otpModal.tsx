import React, { useState, useEffect } from 'react'

interface OtpModalProps {
  isOpen?: boolean | undefined
  onClose: () => void
  otpVerified:(e?: React.FormEvent)=>Promise<void>
  verifyOtp:string // returns true on success, false on error
  onResend: () => void
  emailOrPhone?: string
}

export function OtpModal({
  isOpen,
  onClose,
  otpVerified,
  verifyOtp,
  onResend,
  emailOrPhone,
}: OtpModalProps) {
  const [otp, setOtp] = useState<string >('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)

  // Manage 60-second countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isOpen && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isOpen, resendTimer])

  // Reset state on open/close
  useEffect(() => {
    if (isOpen) {
      setOtp('')
      setError(null)
      setResendTimer(60)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp) {
      setError('Please enter the OTP code.')
      return
    }

    setError(null)
    setLoading(true)



    try {
      
      if (verifyOtp == otp) {
        setError('Invalid OTP code. Please check and try again.')
      }

console.log('executing handlesumit now')

    await otpVerified();
     onClose();

    } catch (err) {
      setError('Failed to verify OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0) return
    
    setError(null)
    try {
      await onResend()
      setResendTimer(60) // Reset countdown timer
    } catch (err) {
      setError('Failed to resend OTP code. Try again.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white rounded-md shadow-xl border border-gray-200 p-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg font-bold"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center pb-4 border-b border-gray-200">
          <h2 className="text-xl font-normal text-gray-700">OTP Verification</h2>
        </div>

        {/* Green Notification Text */}
        <div className="mt-6 text-center">
          <p className="text-emerald-700 font-bold text-base">
            Your OTP has been sent to your {emailOrPhone ? emailOrPhone : 'email address'}
          </p>
        </div>

        {/* OTP Input Form */}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value)
                if (error) setError(null) // clear error while typing
              }}
              placeholder="••••"
              maxLength={4}
              className={`flex-1 border rounded px-3 py-1.5 text-center text-gray-800 focus:outline-none focus:ring-1 ${
                error
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-gray-400'
              }`}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-100 border border-gray-300 hover:bg-gray-200 text-gray-700 font-medium px-4 py-1.5 rounded transition disabled:opacity-50"
            >
              {loading ? '...' : 'Submit'}
            </button>
          </div>

          {/* Error Message Display under Input */}
          {error && (
            <p className="mt-2 text-xs text-red-600 font-medium text-left">
              {error}
            </p>
          )}
        </form>

        {/* Resend OTP Section */}
        <div className="mt-8 text-center">
          {resendTimer > 0 ? (
            <p className="text-xs text-gray-500">
              Resend OTP in <span className="font-semibold">{resendTimer}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-sm text-blue-600 hover:underline font-medium focus:outline-none"
            >
              Resend OTP
            </button>
          )}
        </div>

      </div>
    </div>
  )
}