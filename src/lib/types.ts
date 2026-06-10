export type Role = 'seeker' | 'owner';

export interface Profile {
  id: string;
  role: Role;
  display_name: string;
}

export interface Seeker {
  profile_id: string;
  neighborhood: string;
  lat: number;
  lng: number;
  radius_miles: number;
  shifts: string[];
  bio: string;
  video_url: string | null;
  basics_confirmed: boolean;
  profiles?: Profile;
}

export interface Shop {
  id: string;
  owner_id: string | null;
  name: string;
  neighborhood: string;
  address: string;
  lat: number;
  lng: number;
  vibe: string;
  website: string;
}

export interface Job {
  id: string;
  shop_id: string;
  title: string;
  pay_min: number | null;
  pay_max: number | null;
  shifts: string[];
  description: string;
  is_open: boolean;
  shops?: Shop;
}

export type ApplicationStatus = 'new' | 'seen' | 'interview' | 'hired' | 'passed';

export interface Application {
  id: string;
  job_id: string;
  seeker_id: string;
  status: ApplicationStatus;
  note: string;
  created_at: string;
}
