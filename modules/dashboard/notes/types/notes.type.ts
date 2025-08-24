export type Note = {
  id: string;

  title: string;
  pinned?: boolean;
  favorite?: boolean;
  folder_id?: string | null;
};
