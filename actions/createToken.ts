'use server'

import { streamClient } from "@/lib/streamServer";

export async function createToken(userId: string) {
    const token = streamClient.createToken(userId);
    console.log("create token for user", userId);
    return token;
}