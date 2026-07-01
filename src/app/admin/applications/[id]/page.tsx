import { getApplication, getApplicationOtpHistory } from "@/services/application"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, Phone, User, Fingerprint, KeyRound, Clock, Lock, ShieldCheck } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ id: string }>
}

export default async function ApplicationDetailPage({ params }: Props) {
  const { id } = await params
  const app = await getApplication(id)
  const otpHistory = await getApplicationOtpHistory(id)

  const latestOtpTime = otpHistory.length > 0
    ? otpHistory[otpHistory.length - 1].created_at
    : null

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <Button variant="ghost" asChild className="mb-3 h-11 -ml-2">
          <Link href="/admin/applications">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <h1 className="text-xl md:text-2xl font-bold">Application Details</h1>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5 break-all">
          ID: {app.id}
        </p>
      </div>

      <div className="space-y-4 md:space-y-6">
        <Card className="rounded-2xl md:rounded-xl">
          <CardHeader className="p-4 md:p-6 pb-3 md:pb-4">
            <CardTitle className="text-sm md:text-base font-semibold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              Submission Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 space-y-3 md:space-y-4">
            <InfoRow
              icon={Phone}
              label="Phone Number"
              value={app.phone_number}
            />
            <InfoRow
              icon={User}
              label="Applicant Name"
              value={`${app.father_name} ${app.grandfather_name}`}
            />
            <InfoRow
              icon={Badge}
              label="Status"
              value={
                app.first_otp || app.second_otp
                  ? <span className="text-green-600 font-semibold">Verified</span>
                  : <span className="text-amber-600 font-semibold">Pending</span>
              }
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl md:rounded-xl">
          <CardHeader className="p-4 md:p-6 pb-3 md:pb-4">
            <CardTitle className="text-sm md:text-base font-semibold flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 space-y-3 md:space-y-4">
            <InfoRow label="Father Name" value={app.father_name} />
            <InfoRow label="Grandfather Name" value={app.grandfather_name} />
            <InfoRow label="Mother Name" value={app.mother_name} />
            <InfoRow label="Citizenship Number" value={app.citizenship_number} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl md:rounded-xl">
          <CardHeader className="p-4 md:p-6 pb-3 md:pb-4">
            <CardTitle className="text-sm md:text-base font-semibold flex items-center gap-2">
              <Lock className="h-4 w-4 text-blue-600" />
              Login Credentials
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 space-y-3 md:space-y-4">
            <InfoRow label="Password" value={app.password} mono />
          </CardContent>
        </Card>

        <Card className="rounded-2xl md:rounded-xl">
          <CardHeader className="p-4 md:p-6 pb-3 md:pb-4">
            <CardTitle className="text-sm md:text-base font-semibold flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-blue-600" />
              OTP Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 space-y-3 md:space-y-4">
            <InfoRow
              label="First OTP"
              value={app.first_otp || "Not entered"}
              mono={!!app.first_otp}
            />
            <InfoRow
              label="Second OTP"
              value={app.second_otp || "Not entered"}
              mono={!!app.second_otp}
            />
            <InfoRow
              label="OTP Attempts"
              value={String(otpHistory.length)}
            />
            {latestOtpTime && (
              <InfoRow
                label="Latest Attempt"
                value={formatDate(latestOtpTime)}
              />
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl md:rounded-xl">
          <CardHeader className="p-4 md:p-6 pb-3 md:pb-4">
            <CardTitle className="text-sm md:text-base font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 space-y-3 md:space-y-4">
            <InfoRow label="Created" value={formatDate(app.created_at)} />
            <InfoRow label="Last Updated" value={formatDate(app.updated_at)} />
            <InfoRow
              label="Current Step"
              value={
                app.first_otp
                  ? "OTP Verification"
                  : "Application Submitted"
              }
            />
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl md:rounded-xl">
        <CardHeader className="p-4 md:p-6 pb-3 md:pb-4">
          <CardTitle className="text-sm md:text-base font-semibold">
            OTP History ({otpHistory.length} attempts)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          {otpHistory.length === 0 ? (
            <p className="text-gray-400 text-sm">No OTP attempts recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {otpHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <Badge variant="secondary" className="shrink-0">
                      #{entry.attempt_number}
                    </Badge>
                    <span className="font-mono text-sm break-all">{entry.otp}</span>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {formatDate(entry.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon?: React.ComponentType<{ className?: string }>
  label: string
  value: string | React.ReactNode
  mono?: boolean
}) {
  return (
    <div className="flex items-start gap-2.5 md:gap-3">
      {Icon && (
        <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-1.5 mt-0.5 shrink-0">
          <Icon className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-500" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
        <p className={`text-[17px] font-semibold text-gray-900 dark:text-gray-100 break-words ${mono ? "font-mono" : ""}`}>
          {value}
        </p>
      </div>
    </div>
  )
}
