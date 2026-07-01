"use client"

import { useLocalStorage } from "./use-local-storage"
import type { Step1Data, Step2Data, FormData } from "@/types"

export function useApplicationForm() {
  const [step1Data, setStep1Data] = useLocalStorage<Step1Data | null>("step1", null)
  const [step2Data, setStep2Data] = useLocalStorage<Step2Data | null>("step2", null)

  const setStep1 = (data: Step1Data) => setStep1Data(data)
  const setStep2 = (data: Step2Data) => setStep2Data(data)

  const getFormData = (): FormData | null => {
    if (!step1Data || !step2Data) return null
    return { ...step1Data, ...step2Data }
  }

  const applicationId = typeof window !== "undefined"
    ? window.sessionStorage.getItem("application_id")
    : null

  const setApplicationId = (id: string) => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("application_id", id)
    }
  }

  const clear = () => {
    setStep1Data(null)
    setStep2Data(null)
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("application_id")
    }
  }

  return {
    step1Data,
    step2Data,
    setStep1,
    setStep2,
    getFormData,
    applicationId,
    setApplicationId,
    clear,
  }
}
