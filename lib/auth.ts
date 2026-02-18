import { createClient } from "@/lib/supabase/server"

export type UserRole = 'admin' | 'exec' | 'scholar' | 'team-leader' | 'default'

export async function getUserRole(): Promise<UserRole> {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.getClaims()
  
  if (error || !data?.claims) {
    return 'default'
  }
  
  // Extract role from claims
  // You can customize this based on how you store roles in your Supabase setup
  const role = data.claims.role || data.claims.user_role || data.claims.app_metadata?.role
  
  // Map the role to our defined UserRole type
  switch (role?.toLowerCase()) {
    case 'admin':
    case 'administrator':
      return 'admin'
    case 'exec':
    case 'executive':
      return 'exec'
    case 'scholar':
    case 'researcher':
      return 'scholar'
    case 'team-leader':
    case 'team_leader':
    case 'lead':
      return 'team-leader'
    default:
      return 'default'
  }
}

export async function getUserProfile() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}
