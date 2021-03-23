export default function (state = {}, action) {
    console.log("The state is", state);
    let nextState = {};
    if (action.type == "RECEIVE_USERS") {
        nextState = {
            ...state,
            users: action.users,
            // wannabes: action.users.filter((user) => user.accepted !== true),
        };
    }
    if (action.type == "ACCEPT_USERS") {
        nextState = {
            ...state,
            users: state.users.map((user) => {
                console.log(user.id, state.id);
                if (
                    user.id === action.senderId ||
                    user.id === action.recipientId
                ) {
                    return {
                        ...user,
                        accepted: true,
                    };
                } else {
                    return { ...user };
                }
            }),
            // wannabes: state.users.filter((user) => {
            //     return user.sender_id !== user.id && user.accepted !== true;
            // }),
        };
    }
    if (action.type == "DELETE_USERS") {
        nextState = {
            ...state,
            users: state.users.filter((user) => {
                return (
                    action.senderId !== user.id &&
                    user.id !== action.recipientId
                );
            }),
            //     wannabes: state.users.filter((user) => {
            //         return (

            //             user.accepted === false
            //         );
            //     }),
        };
    }
    if (action.type == "CHAT_MESSAGES") {
        console.log("chatmsgs action", action)
        nextState = {
            ...state,
            chatMessages: action.msgs
        };
    }
    if (action.type == "CHAT_MESSAGE") {
        console.log("CHAT MESSAGE in action", action.msg);
        nextState = {
            ...state,
            chatMessages: state.chatMessages.concat(action.msg)
           
        };
    }
    console.log("NEXT State", nextState);
    return nextState;
}
