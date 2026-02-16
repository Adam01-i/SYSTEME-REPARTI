import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roomService } from "../services/room.service";
import { RoomPayload } from "../types/room";

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<RoomPayload>;
    }) => roomService.updateRoom(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
};
