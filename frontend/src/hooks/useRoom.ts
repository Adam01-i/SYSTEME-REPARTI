import { useQuery } from "@tanstack/react-query";
import { roomService } from "../services/room.service";
import { Room } from "../types/room";

export const useRoom = (id: string) => {
  return useQuery<Room>({
    queryKey: ["room", id],
    queryFn: () => roomService.getRoomById(id),
    enabled: !!id,
  });
};
