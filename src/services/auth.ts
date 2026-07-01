"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function signInAdmin(email: string, password: string) {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw new Error(error.message)
}

export async function signOutAdmin() {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.auth.signOut()

  if (error) throw new Error(error.message)
}

export async function getSession() {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase.auth.getSession()

  if (error) return null
  return data.session
}

export async function isAdminAuthenticated() {
  const session = await getSession()
  return session !== null
}
