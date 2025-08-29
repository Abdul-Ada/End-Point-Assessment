export type Role = 'APPRENTICE' | 'COACH'
export type EntryStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED'

export interface Profile { id: string; email: string | null; display_name: string | null; role: Role }
export interface DiaryEntry {
  id: string; user_id: string; date: string; title: string; body: string;
  minutes_spent: number; ksb_tags: string[]; evidence_urls: string[]; status: EntryStatus; created_at: string
}
export interface SmartGoal {
  id: string; user_id: string; title: string; description?: string; start_date: string;
  target_date: string; measure: string; relevant_ksbs: string[]; status: string; created_at: string
}
export interface Comment { id: string; entry_id: string; coach_id: string | null; body: string; created_at: string }