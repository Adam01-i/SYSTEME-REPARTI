// frontend/src/services/room.service.ts
import { api } from "../lib/api";
import {
  Room,
  RoomPayload,
  PaginatedRooms,
  RoomFilters,
} from "../types/room";

export const roomService = {
  async getRooms(filters: RoomFilters): Promise<PaginatedRooms> {
    const response = await api.get<PaginatedRooms>("/rooms/", {
      params: filters,
    });
    return response.data;
  },

  async getRoomById(id: string): Promise<Room> {
    const response = await api.get<Room>(`/rooms/${id}`);
    return response.data;
  },

  async createRoom(payload: RoomPayload): Promise<Room> {
    const response = await api.post<Room>("/rooms/", payload);
    return response.data;
  },

  async updateRoom(id: string, payload: Partial<RoomPayload>): Promise<Room> {
    const response = await api.put<Room>(`/rooms/${id}`, payload);
    return response.data;
  },

  async deleteRoom(id: string): Promise<{ msg: string }> {
    const response = await api.delete<{ msg: string }>(`/rooms/${id}`);
    return response.data;
  },
};
