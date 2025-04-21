import { z } from "zod";
export const groupChatSchema = z.object({
    name: z.string().min(1, "Group name is required"), // Ensure name is not empty
    members: z.array(
        z.string()
    ).min(1, "At least one member is required"), // Ensure at least one member
    addmembersallowed: z.boolean().optional(),
    sendmessageallowed: z.boolean().optional(),
});

export const addMembersSchema = z.object({
    chatId: z.string().min(1, "Chat ID is required"), // Ensure chatId is not empty
    members: z.array(
        z.string()
    ).min(1, "At least one member is required"), // Ensure at least one member
});

export const removeMembersSchema = z.object({
    chatId: z.string().min(1, "Chat ID is required"), // Ensure chatId is not empty
    userId: z.string().min(1, "Chat ID is required"), // Ensure at least one member
});

export const makeAdminSchema = z.object({
    chatId: z.string().min(1, "Chat ID is required"), // Ensure chatId is not empty
    userId: z.string().min(1, "User ID is required"), // Ensure at least one member
});
export const removeAdminSchema = z.object({
    chatId: z.string().min(1, "Chat ID is required"), // Ensure chatId is not empty
    userId: z.string().min(1, "User ID is required"), // Ensure at least one member
});
export const updateGroupProfileSchema = z.object({
    name: z.string().trim().min(1, "Name cannot be empty").optional(),
    sendmessageallowed: z.boolean().optional(),
    addmembersallowed: z.boolean().optional(),
    
  });
export const updateGroupSchema = z.object({
    name: z.string().trim().min(1, "Name cannot be empty").optional(),
    sendmessageallowed: z.boolean().optional(),
    addmembersallowed: z.boolean().optional(),
})
