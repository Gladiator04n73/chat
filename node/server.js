const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const messages = {};
const unreadCounts = {};
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', ({ user1, user2 }) => {
    const room = [user1, user2].sort().join('_');

    // Leave all other rooms except this one
    const rooms = Array.from(socket.rooms);
    rooms.forEach(r => {
      if (r !== socket.id && r !== room) {
        socket.leave(r);
        console.log(`User ${socket.id} left room ${r}`);
      }
    });

    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);

    
    if (messages[room]) {
      messages[room].forEach(message => socket.emit('newMessage', message));
    } else {
      messages[room] = [];
    }

    
    if (unreadCounts[user1] && unreadCounts[user1][user2]) {
      socket.emit('unreadCount', { fromUserId: user2, count: unreadCounts[user1][user2] });
    }
   
    if (unreadCounts[user2] && unreadCounts[user2][user1]) {
      socket.emit('unreadCount', { fromUserId: user1, count: unreadCounts[user2][user1] });
    }
  });

  socket.on('sendMessage', ({ sender_id, receiver_id, content }) => {
    const room = [sender_id, receiver_id].sort().join('_');
    const message = {
      id: Date.now(),
      sender_id,
      receiver_id,
      content,
      created_at: new Date().toISOString(),
    };

    if (!messages[room]) {
      messages[room] = [];
    }
    messages[room].push(message);

    
    if (!unreadCounts[receiver_id]) {
      unreadCounts[receiver_id] = {};
    }
    if (!unreadCounts[receiver_id][sender_id]) {
      unreadCounts[receiver_id][sender_id] = 0;
    }
    unreadCounts[receiver_id][sender_id] += 1;

    io.to(room).emit('newMessage', message);

    
    io.sockets.sockets.forEach((s) => {
      if (s.id !== socket.id) {
        s.emit('unreadCount', { fromUserId: sender_id, count: unreadCounts[receiver_id][sender_id] });
      }
    });
  });

  socket.on('markAsRead', ({ userId, fromUserId }) => {
    if (unreadCounts[userId] && unreadCounts[userId][fromUserId]) {
      unreadCounts[userId][fromUserId] = 0;
      
      io.sockets.sockets.forEach((s) => {
        s.emit('unreadCount', { fromUserId, count: 0 });
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Chat server listening on port ${PORT}`);
});
