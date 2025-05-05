
export interface Leader {
  id?: string;
  name: string;
  position: string;
  initial: string;
  bio?: string;
  profileImage?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface TenureInfo {
  year: string;
  declaration: string;
}

export interface LeadershipState {
  leaders: Leader[];
  loading: boolean;
  count: number;
}
