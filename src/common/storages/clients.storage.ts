import { Socket } from 'socket.io';

class ClientsStorage {
  private static instance: ClientsStorage | null = null;
  private clients: Map<number, Socket[]> = new Map();

  public static get getInstance(): ClientsStorage {
    if (!this.instance) {
      this.instance = new ClientsStorage();
    }

    return this.instance;
  }

  public get getClients(): Map<number, Socket[]> {
    return this.clients;
  }

  public getByUserId(userId: number): Socket[] | null {
    if (this.clients.has(userId)) {
      return this.clients.get(userId);
    }

    return null;
  }

  public getByUsersIds(usersIds: number[]): Socket[] {
    const result: Socket[] = [];

    for (const userId of usersIds) {
      if (this.clients.has(userId)) {
        result.push(...this.clients.get(userId));
      }
    }

    return result;
  }

  public getUserIdByClientId(clientId: string): number | null {
    for (const [userId, sockets] of this.clients.entries()) {
      if (sockets.find((socket) => socket.id === clientId)) return userId;
    }

    return null;
  }

  public addClient(userId: number, client: Socket) {
    if (this.clients.has(userId)) {
      this.clients.get(userId).push(client);
      return;
    }

    this.clients.set(userId, [client]);
  }

  public removeClient(userId: number, client: Socket) {
    if (this.clients.has(userId)) {
      const sockets = this.clients
        .get(userId)
        .filter((socket) => socket.id !== client.id);

      if (!sockets.length) {
        this.clients.delete(userId);
      }

      this.clients.set(userId, sockets);
      return;
    }
  }
}

export default ClientsStorage;
