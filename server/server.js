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

app.get("/api/room-exists/:roomId", (req, res) => {
    const { roomId } = req.params;

    const room = rooms.find((room) => room.id === roomId);

    if (room) {
        if (room.connectedUser.length >= 4) {
            return res.send({ roomExists: true, full: true });
        }
        return res.send({ roomExists: true, full: false });
    }

    return res.send({ roomExists: false });
});

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`user connected ${socket.id}`);

    socket.on("create-new-room", (data) => {
        createNewRoomHandler(socket, data);
    });

    socket.on("join-room", (data) => {
        Joinroomhandler(data, socket);
    });

    socket.on("disconnect", () => {
        disconnectHandler(socket);
    });

    socket.on("conn-signal", (data) => {
        signalingHandler(data, socket);
    });

    socket.on("conn-init", (data) => {
        initializingConnectionhandler(data, socket);
    });
});

function initializingConnectionhandler(data, socket) {
    const { connectedUserSocketId } = data;

    io.to(connectedUserSocketId).emit("conn-init", {
        connectedUserSocketId: socket.id,
    });
}

function signalingHandler(data, socket) {
    const { connectedUserSocketId, signal } = data;

    io.to(connectedUserSocketId).emit("conn-signal", {
        signal,
        connectedUserSocketId: socket.id,
    });
}

function disconnectHandler(socket) {
    const user = connectedUser.find((user) => user.socketId === socket.id);

    if (!user) return;

    const room = rooms.find((room) => room.id === user.roomId);

    if (!room) return;

    room.connectedUser = room.connectedUser.filter(
        (user) => user.socketId !== socket.id
    );

    connectedUser = connectedUser.filter(
        (user) => user.socketId !== socket.id
    );

    socket.leave(user.roomId);

    io.to(room.id).emit("room-update", {
        connectedUser: room.connectedUser,
    });
}

const createNewRoomHandler = (socket, data) => {
    const { identity } = data;
    const roomId = randomUUID();

    const newUser = {
        identity,
        id: randomUUID(),
        socketId: socket.id,
        roomId,
    };

    connectedUser.push(newUser);

    const newRoom = {
        id: roomId,
        connectedUser: [newUser],
    };

    rooms.push(newRoom);

    socket.join(roomId);

    socket.emit("room-id", { roomId });
    socket.emit("room-update", {
        connectedUser: newRoom.connectedUser,
    });
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

    socket.emit("existing-users", {
        existingUsers: room.connectedUser.map((u) => u.socketId),
    });

    room.connectedUser.forEach((user) => {
        io.to(user.socketId).emit("new-user", {
            socketId: socket.id,
        });
    });

    room.connectedUser.push(newUser);
    connectedUser.push(newUser);

    socket.join(roomId);

    io.to(roomId).emit("room-update", {
        connectedUser: room.connectedUser,
    });
}

server.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});