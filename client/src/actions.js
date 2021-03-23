import axios from "axios";

var boolean = true;

export async function receiveUsers() {
    const { data } = await axios.get("/get-friends");
    console.log("all user relationships", data);
    return {
        type: "RECEIVE_USERS",
        users: data.data,
    };
}

export async function acceptRequest(arg) {
    const { data } = await axios.post("/friend-status/" + arg, { boolean });
    console.log("user accepted", data);
    return {
        type: "ACCEPT_USERS",
        senderId: data.data.sender_id,
        recipientId: data.data.recipient_id,
    };
}

export async function unFriend(arg) {
    const { data } = await axios.post("/friend-status-delete", { arg });
    console.log("user deleted", data);
    return {
        type: "DELETE_USERS",
        senderId: data.data[0].sender_id,
        recipientId: data.data[0].recipient_id,
    };
}

export async function chatMessages(arg) {
    return {
        type: "CHAT_MESSAGES",
        msgs: arg
    };
}

export async function chatMessage(arg) {
    return {
        type: "CHAT_MESSAGE",
        msg:arg
    };
}