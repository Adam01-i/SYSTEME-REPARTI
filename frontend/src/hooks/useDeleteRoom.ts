import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roomService } from "../services/room.service";

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roomService.deleteRoom(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
};
