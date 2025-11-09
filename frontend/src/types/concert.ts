export interface Concert {
  id: number;
  date: string;         // ISO date string
  city: string;
  venue: string;
  ticket_url: string;
  is_active: boolean;
}
