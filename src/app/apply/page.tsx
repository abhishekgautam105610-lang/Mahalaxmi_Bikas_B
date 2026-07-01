"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useApplicationForm } from "@/hooks/use-application-form"
import { createApplication } from "@/services/application"
import { toast } from "sonner"
import { ArrowLeft, User, Users, Fingerprint } from "lucide-react"

export default function Step2Page() {
  const router = useRouter()
  const { step1Data, setStep2, setApplicationId } = useApplicationForm()
  const [fatherName, setFatherName] = useState("")
  const [grandfatherName, setGrandfatherName] = useState("")
  const [motherName, setMotherName] = useState("")
  const [citizenshipNumber, setCitizenshipNumber] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  if (!step1Data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500 mb-4">Please start from the beginning.</p>
            <Button onClick={() => router.push("/")}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!fatherName.trim()) newErrors.fatherName = "Father name is required"
    if (!grandfatherName.trim()) newErrors.grandfatherName = "Grandfather name is required"
    if (!motherName.trim()) newErrors.motherName = "Mother name is required"
    if (!citizenshipNumber.trim()) newErrors.citizenshipNumber = "Citizenship number is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const data = {
        phone_number: step1Data.number,
        password: step1Data.password,
        father_name: fatherName.trim(),
        grandfather_name: grandfatherName.trim(),
        mother_name: motherName.trim(),
        citizenship_number: citizenshipNumber.trim(),
      }

      const app = await createApplication(data)
      setStep2({
        father_name: data.father_name,
        grandfather_name: data.grandfather_name,
        mother_name: data.mother_name,
        citizenship_number: data.citizenship_number,
      })
      setApplicationId(app.id)
      toast.success("Application submitted successfully")
      router.push("/otp")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
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
              <CardTitle className="text-xl">Personal Information</CardTitle>
              <CardDescription>
                Please fill in your family details
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="fatherName"
                    placeholder="Enter your father's name"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.fatherName && (
                  <p className="text-sm text-red-500">{errors.fatherName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="grandfatherName">Grandfather Name</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="grandfatherName"
                    placeholder="Enter your grandfather's name"
                    value={grandfatherName}
                    onChange={(e) => setGrandfatherName(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.grandfatherName && (
                  <p className="text-sm text-red-500">{errors.grandfatherName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="motherName">Mother Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="motherName"
                    placeholder="Enter your mother's name"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.motherName && (
                  <p className="text-sm text-red-500">{errors.motherName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="citizenship">Citizenship Number</Label>
                <div className="relative">
                  <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="citizenship"
                    placeholder="Enter your citizenship number"
                    value={citizenshipNumber}
                    onChange={(e) => setCitizenshipNumber(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.citizenshipNumber && (
                  <p className="text-sm text-red-500">{errors.citizenshipNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 pb-[env(safe-area-inset-bottom)]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="h-12 w-full text-base"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button type="submit" className="h-12 w-full text-base" disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
