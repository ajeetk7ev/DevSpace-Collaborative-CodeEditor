import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

console.log("SERVER IS RUNNING");

// Structure: roomId -> Set of { user: string, socket: WebSocket }
const rooms = new Map<string, Set<{ user: string, socket: WebSocket }>>();

wss.on('connection', (ws) => {
  console.log("New User Connected");

  let currentRoom = "";
  let currentUser = "";

  ws.on('message', (message) => {
    const data = JSON.parse(message.toString());

    switch (data.type) {
      case 'join': {
        const { room, user } = data.payload;
        currentRoom = room;
        currentUser = user;

        if (!rooms.has(room)) {
          rooms.set(room, new Set());
        }

        rooms.get(room)?.add({ user, socket: ws });

        console.log(`User "${user}" joined room "${room}"`);

        // Notify others
        broadcastToRoom(room, {
          type: "user-joined",
          payload: { user }
        }, ws);

        break;
      }

      case 'code-change': {
        const { room, code } = data.payload;

        broadcastToRoom(room, {
          type: 'code-update',
          payload: { code }
        }, ws);

        break;
      }

      default:
        console.log("Unknown message type:", data.type);
    }
  });

  ws.on('close', () => {
    if (currentRoom && rooms.has(currentRoom)) {
      const userSet = rooms.get(currentRoom)!;
      for (const item of userSet) {
        if (item.socket === ws) {
          userSet.delete(item);
          console.log(`User "${item.user}" disconnected from room "${currentRoom}"`);

          // Notify others
          broadcastToRoom(currentRoom, {
            type: "user-left",
            payload: { user: item.user }
          }, ws);

          break;
        }
      }

      if (userSet.size === 0) {
        rooms.delete(currentRoom);
      }
    }
  });

  ws.send(JSON.stringify({ type: 'welcome', message: 'Connected to server!' }));
});

// Helper: Broadcast to room except sender
function broadcastToRoom(room: string, message: any, senderSocket: WebSocket) {
  const roomUsers = rooms.get(room);
  if (!roomUsers) return;

  const messageStr = JSON.stringify(message);

  for (const { socket } of roomUsers) {
    if (socket !== senderSocket && socket.readyState === socket.OPEN) {
      socket.send(messageStr);
    }
  }
}
