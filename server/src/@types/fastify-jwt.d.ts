import '@fastify/jwt/jwt'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      sub: string;
      name: string;
      avatarUrl: string;
    }
  }
}