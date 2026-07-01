"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function SuccessPage() {
  const router = useRouter()

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
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-xl">Application Submitted</CardTitle>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Your application has been submitted successfully. We will contact
              you shortly.
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push("/")} className="w-full">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
