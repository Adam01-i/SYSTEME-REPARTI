import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roomService } from "../services/room.service";
import { RoomPayload } from "../types/room";

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RoomPayload) =>
      roomService.createRoom(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
};
