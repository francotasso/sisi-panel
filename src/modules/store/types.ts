export interface StoreContact {
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  address_map?: string;
}

export interface StoreHours {
  day: string;
  open_time?: string;
  close_time?: string;
  is_closed?: boolean;
}

export interface StoreSocialMedia {
  platform: string;
  url: string;
}

export interface Store {
  id?: number;
  store_name: string;
  description?: string;
  contact?: StoreContact;
  hours?: StoreHours[];
  social_media?: StoreSocialMedia[];
  created_at?: string;
}

export interface StoreFormData {
  store_name: string;
  description?: string;
  contact?: StoreContact;
  hours?: StoreHours[];
  social_media?: StoreSocialMedia[];
}
