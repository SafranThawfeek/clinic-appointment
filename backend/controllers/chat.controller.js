import Message from "../models/message.model.js";

// get messages for a chat room (chatId)
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// list recent chats (grouped by chatId with last message)
export const getRecentChats = async (req, res) => {
  try {
    // simple: get last message per chatId
    const agg = await Message.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$chatId",
          lastMsg: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$lastMsg" } },
      { $sort: { createdAt: -1 } },
    ]);
    res.json(agg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
