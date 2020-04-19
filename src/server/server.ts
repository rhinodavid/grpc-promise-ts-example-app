import { Server, ServerCredentials } from "grpc";

import jokeHandler from "./jokeHandler";

const buildServer = (): Server => {
  const server: Server = new Server();

  [jokeHandler].forEach(({ service, handler }) =>
    server.addService(service, handler)
  );
  return server;
};

export const startServer = async (
  port: number,
  host: string = "0.0.0.0",
  credentials?: ServerCredentials
): Promise<Server> => {
  if (!credentials) {
    console.warn("⚠️⚠️⚠️ Using insecure credentials ⚠️⚠️⚠️");
    credentials = ServerCredentials.createInsecure();
  }
  const server = buildServer();
  return new Promise<Server>((resolve, reject) => {
    server.bindAsync(
      `${host}:${port}`,
      credentials as ServerCredentials,
      (e: Error | null, _port: number) => {
        if (e != null) {
          reject(e);
        } else {
          resolve(server);
        }
      }
    );
    server.start();
  });
};

export default buildServer;
