import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";

// Get or create a chat room between two users
export async function getOrCreateChatRoom(userAId, userBId) {
  const chatRoomsRef = collection(db, "chatRooms");
  const q = query(
    chatRoomsRef,
    where("participants", "array-contains", userAId)
  );
  const snapshot = await getDocs(q);
  let room = null;
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.participants.includes(userBId)) {
      room = { id: docSnap.id, ...data };
    }
  });
  if (room) return room;
  // Create new room
  const docRef = await addDoc(chatRoomsRef, {
    participants: [userAId, userBId],
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, participants: [userAId, userBId] };
}

// Listen to messages in a chat room
export function listenToMessages(roomId, callback) {
  const messagesRef = collection(db, "chatRooms", roomId, "messages");
  const q = query(messagesRef, orderBy("createdAt"));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  });
}

// Send a message
export async function sendMessage(roomId, senderId, text) {
  const messagesRef = collection(db, "chatRooms", roomId, "messages");
  await addDoc(messagesRef, {
    senderId,
    text,
    createdAt: serverTimestamp(),
  });
}
