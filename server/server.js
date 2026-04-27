import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { randomUUID } from "crypto";

const PORT = 5002;

const app = express();
const server = http.createServer(app);

app.use(cors());

let connectedUser = [];
let rooms = [];

/**
 * ✅ CHECK IF ROOM EXISTS (same as yours, fixed)
 */
app.get("/api/room-exists/:roomId", (req, res) => {
    const { roomId } = req.params;

    const room = rooms.find((room) => room.id === roomId);

    if (room) {
        if (room.connectedUser.length >= 4) {
            return res.send({ roomExists: true, full: true });
        } else {
            return res.send({ roomExists: true, full: false });
        }
    } else {
        return res.send({ roomExists: false });
    }
});

/**
 * ✅ SOCKET SETUP
 */
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`user connected successfully ${socket.id}`);

    socket.on("create-new-room", (data) => {
        createNewRoomHandler(socket, data); // ✅ pass socket
    });
    socket.on('join-room', (data) => {
        console.log('join room socket')
        Joinroomhandler(data, socket)
    });
    socket.on('disconnect', () => {
        disconnectHandler(socket)
    });
    socket.on('conn-signal', data => {
        signalingHandler(data, socket);
    });
    socket.on('conn-init', data => {
        initializingConnectionhandler(data, socket)
    })
});
function functioninitializingConnectionhandler(data, socket) {
    const { connectedUserSocketId } = data;
    const initData = { connectedUserSocketId: socket.id };
    io.to(connectedUserSocketId).emit('conn-init', initData)
}

function signalingHandler(data, socket) {
    const { connectedUserSocketId, signal } = data;
    const signalingData = { signal, connectedUserSocketId: socket.id };
    io.to(connectedUserSocketId).emit('conn-signal', signalingData)

}
// dis connect handler
function disconnectHandler(socket) {
    // find if user has been register , if yes remove him from 
    const user = connectedUser.find(user => user.socketId === socket.id);
    if (user) {
        const room = rooms.find(room => room.id === user.roomId);
        room.connectedUser = room.connectedUser.filter(user => user.socketId !== socket.id);
        // leave the socket io room 
        socket.leave(user.roomId);
        io.to(room.id).emit('room-update', {
            connectedUser: room.connectedUser
        })
        /// close the room if amount the user which will stay in room wil be o 
    }

}
/**
 * ✅ CREATE ROOM HANDLER (fixed only)
 */
const createNewRoomHandler = (socket, data) => {
    console.log("host is creating new room");
    console.log(data);

    const { identity } = data;
    const roomId = randomUUID();

    const newUser = {
        identity,
        id: randomUUID(),
        socketId: socket.id, // ✅ now works
        roomId,
    };

    // add user
    connectedUser = [...connectedUser, newUser];

    const newRoom = {
        id: roomId,
        connectedUser: [newUser],
    };

    // ✅ correct way to join room
    socket.join(roomId);

    // add room
    rooms = [...rooms, newRoom];

    // ✅ send only to creator (not everyone)
    socket.emit("room-id", { roomId });
    console.log('connected user', newRoom.connectedUser)
    socket.emit('room-update', { connectedUser: newRoom.connectedUser });

};
function Joinroomhandler(data, socket) {
    const { identity, roomId } = data;

    const room = rooms.find((room) => room.id === roomId);

    if (!room) return;

    const newUser = {
        identity,
        id: randomUUID(),
        socketId: socket.id,
        roomId,
    };

    // 🔥 1. Send existing users to NEW user
    socket.emit("existing-users", {
        existingUsers: room.connectedUser.map((u) => u.socketId),
    });

    // 🔥 2. Notify existing users about NEW user
    room.connectedUser.forEach((user) => {
        io.to(user.socketId).emit("new-user", {
            socketId: socket.id,
        });
    });

    // 🔥 3. Add user
    room.connectedUser.push(newUser);
    connectedUser.push(newUser);

    socket.join(roomId);

    io.to(roomId).emit("room-update", {
        connectedUser: room.connectedUser,
    });
}
server.listen(PORT, () => {
    console.log(`server is listening at ${PORT}`);
});