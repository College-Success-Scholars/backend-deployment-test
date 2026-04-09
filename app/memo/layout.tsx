import React from 'react'
import { requireTeamLeaderOrAbove } from '@/lib/supabase/server';

export default async function MemoLayout({ children }: { children: React.ReactNode }) {
  //await requireTeamLeaderOrAbove();
  return <>{children}</>;
  
}
