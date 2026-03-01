export type PrivacyLevel = "private" | "link" | "public";

export interface Publication {
  id: string;
  user_id: string;
  title: string;
  privacy_level: PrivacyLevel;
  share_token: string | null;
  created_at: string;
}

export interface Photo {
  id: string;
  publication_id: string;
  storage_path: string;
  caption: string | null;
  order_index: number;
}
