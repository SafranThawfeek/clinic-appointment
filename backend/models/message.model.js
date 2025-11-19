import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chatId: { type: String, required: true },   // e.g. "userId_doctorId" or room id
  senderId: { type: String, required: true }, // user id of sender
  senderName: String,
  text: String,
  type: { type: String, default: "text" }, // text | image | audio etc.
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

export default mongoose.model("Message", messageSchema);
