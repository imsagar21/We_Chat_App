import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  isUserLoading: false,
  selectedUser: null,
  isMessagesLoading: false,
  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUserLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessages: async (messageData) => {
    const { selectedUser, messages } = get();

    try {
      const res = await axiosInstance.post(
        `message/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },
  subscribeToMessages:()=>{
    const {selectedUser}  = get()
    if(!selectedUser) return;
    const socket = useAuthStore.getState().socket

    socket.on("newMessage",(newMessages)=>{
      const isMessageSentFromSelectedUser=newMessages.senderId===selectedUser._id
      if(!isMessageSentFromSelectedUser) return;
      set({messages:[...get().messages,newMessages ]})

    })
  },
  unSubscribeToMessages:()=>{
    const socket = useAuthStore.getState().socket
    socket.off("newMessages")
  }
}));
export default useChatStore;
