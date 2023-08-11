import { createSlice } from "@reduxjs/toolkit";

const roomSlice = createSlice({
  name: "room",
  initialState: {
    id: null,
    owner: null,
    users: null,
    messages: null,
  },
  reducers: {
    setID(state, action) {
      state.id = action.payload.id;
    },
    setOwner(state, action) {
      state.owner = action.payload.owner;
    },
    setUsers(state, action) {
      state.users = action.payload.users;
    },
    setMessages(state, action) {
      state.messages = action.payload.messages;
    },
    setRoom(state, action) {
      state.id = action.payload.id;
      state.owner = action.payload.owner;
      state.users = action.payload.users;
      state.messages = action.payload.messages;
    },
  },
});

export default roomSlice;
export const roomActions = roomSlice.actions;
