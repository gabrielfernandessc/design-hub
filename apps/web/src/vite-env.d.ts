/// <reference types="vite/client" />

declare module '@design-hub/config/schema' {
  export * from '@design-hub/config/src/schema'
}

declare module '@design-hub/config/services/sla' {
  export * from '@design-hub/config/src/services/sla'
}

declare module '@design-hub/config/services/notifications' {
  export * from '@design-hub/config/src/services/notifications'
}

declare module '@design-hub/config/services/stripe' {
  export * from '@design-hub/config/src/services/stripe'
}

// Elysia JWT augmentation
declare module 'elysia' {
  interface Context {
    jwt: {
      sign: (payload: Record<string, unknown>) => Promise<string>
      verify: (token: string) => Promise<Record<string, unknown> | null>
    }
  }
}
