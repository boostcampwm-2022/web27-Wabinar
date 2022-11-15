declare namespace Express {
  interface Request {
    user: { id: number; name: string; avatarUrl: string };
  }
}
