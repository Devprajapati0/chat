import { z } from "zod";
export const groupChatSchema = z.object({
    name: z.string().min(1, "Group name is required"), // Ensure name is not empty
    members: z.array(
        z.string()
    ).min(1, "At least one member is required") // Ensure at least one member
});