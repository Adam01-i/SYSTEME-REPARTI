export interface Room {
  id: string;
  name: string;
  description: string;
  price_per_night: number;
  capacity: number;
  room_type: string;
  images: string[] | null;
  amenities: string[] | null;
  created_at: string | null;
  updated_at: string | null;
}

/**
 * Payload utilisé pour création / update
 */
export interface RoomPayload {
  name: string;
  description: string;
  price_per_night: number;
  capacity: number;
  room_type: string;
  images?: string[] | null;
  amenities?: string[] | null;
}

export interface PaginatedRooms {
  items: Room[];
  total: number;
  page: number;
  pages: number;
}

export interface RoomFilters {
  search?: string;
  min_price?: number;
  max_price?: number;
  capacity?: number;
  room_type?: string;
  page?: number;
  per_page?: number;
}
