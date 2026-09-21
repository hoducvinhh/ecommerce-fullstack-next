import { createAuthClient } from "better-auth/client";

function serverBaseUrl(): string {
    return (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
}

function createConfiguredClient(baseURL: string) {
    return createAuthClient({
        baseURL,
        basePath: '/api/auth',
    })
}

type AuthClient = ReturnType<typeof createConfiguredClient>;

let browerClient: AuthClient | null = null;

let browserOrigin: string | null = null;

export function getAuthClient(): AuthClient {
    if (typeof window !== 'undefined') {
        const origin = window.location.origin;

        if (!browerClient || browserOrigin != origin) {
            browerClient = createConfiguredClient(origin);
            browserOrigin = origin;
        }
        return browerClient;
    }
    return createConfiguredClient(serverBaseUrl());
}