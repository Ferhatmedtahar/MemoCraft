export type Note = {
  id: string;

  title: string;
  pinned?: boolean;
  favorite?: boolean;
  folder_id?: string | null;
};

export type NoteId = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  is_favorite: boolean;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  pinned: boolean;
  favorite: boolean;
  folder_id: string;
};
