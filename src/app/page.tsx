"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useApplicationForm } from "@/hooks/use-application-form"
import { Eye, EyeOff, Phone, Lock } from "lucide-react"

export default function Step1Page() {
  const router = useRouter()
  const { setStep1 } = useApplicationForm()
  const [number, setNumber] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ number?: string; password?: string }>({})

  const validate = () => {
    const newErrors: { number?: string; password?: string } = {}
    if (!number.trim()) newErrors.number = "Phone number is required"
    else if (!/^\d{10}$/.test(number.trim())) newErrors.number = "Enter a valid 10-digit phone number"
    if (!password.trim()) newErrors.password = "Password is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setStep1({ number: `+977${number.trim()}`, password: password.trim() })
    router.push("/apply")
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
            <CardTitle className="text-xl">Welcome</CardTitle>
            <CardDescription>
              Enter your details to begin the application and verify KYC
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="number">Mobile Number</Label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <div className="flex w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 transition-all duration-200">
                    <span className="flex items-center pl-10 pr-1 text-sm text-gray-500 dark:text-gray-400 select-none border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-l-lg">
                      +977
                    </span>
                    <input
                      id="number"
                      type="tel"
                      placeholder="98XXXXXXXX"
                      value={number}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "")
                        setNumber(val)
                      }}
                      className="flex-1 h-10 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-transparent outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>
                </div>
                {errors.number && (
                  <p className="text-sm text-red-500">{errors.number}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <div className="flex w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 transition-all duration-200">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex-1 h-10 pl-10 pr-12 py-2 text-sm text-gray-900 dark:text-gray-100 bg-transparent outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <Button type="submit" className="w-full h-12 text-base">
                Continue
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
