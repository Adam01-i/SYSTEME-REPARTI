import { useQuery } from "@tanstack/react-query";
import { roomService } from "../services/room.service";
import { RoomFilters } from "../types/room";

export const useRooms = (filters: RoomFilters) => {
  return useQuery({
    queryKey: ["rooms", filters],
    queryFn: () => roomService.getRooms(filters),
    placeholderData: (previousData) => previousData, // 🔥 pagination fluide
    staleTime: 1000 * 60 * 5, // cache 5 minutes
  });
};
