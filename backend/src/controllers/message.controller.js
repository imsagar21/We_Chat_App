import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";


export const getUsersForSideBars = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    if(!filteredUsers){
        return res.status(400).json({message:"No Other Users Present"})
    }
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("error in getUsersForSideBars", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("error in get messages", error.message);
    res.status(500).json({ message: "Interna; server error" });
  }
};

export const sendMessages =async(req,res)=>{
    try {
        const {text,image} = req.body
        const senderId =req.user._id
        const {id:receiverId} = req.params

        let imageURL;
        if(image){
            const updatedResponse = await cloudinary.uploader.upload(image)
            imageURL =  updatedResponse.secure_url
        }
        const newMessage = new Message({
            senderId:senderId,
            receiverId,
            text,
            image:imageURL
        })
        await newMessage.save()

        const RecieverSocketId = getReceiverSocketId(receiverId)
        if(RecieverSocketId){ 
          io.to(RecieverSocketId).emit("newMessage",newMessage)
        }
        res.status(200).json(newMessage)
    } catch (error) {
        console.log("error in send messages",error.message);
        res.status(500).json({message:"Internal server error"})
    }
}
