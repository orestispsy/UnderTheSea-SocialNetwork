import { useEffect, useRef} from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux"

export default function Chat ({ }) {
    const elemRef = useRef();

    const chatMessages = useSelector((state) => state && state.chatMessages);
    console.log("THE MESSAGES", chatMessages);

    useEffect(() => {

        if (elemRef.current) {
            console.log("elemRef", elemRef.current);
            console.log(
                "elemRef.current.scrollHeight",
                elemRef.current.scrollHeight
            );
            console.log(
                "elemRef.current.clientHeight",
                elemRef.current.clientHeight
            );
            console.log("elemRef.current.scrollTop", elemRef.current.scrollTop);

            const newScrollTop =
                elemRef.current.scrollHeight - elemRef.current.clientHeight;
            elemRef.current.scrollTop = newScrollTop;
        }
    }, []);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            console.log("TEXTAREA VALUE", e.target.value);
            socket.emit("A CHAT MSG", e.target.value);
            e.target.value = "";
        }
    };

       if (!chatMessages) {
           return null;
       }

    return (
        <div className="chatContainer">
            <h1>Live Chat</h1>
            <div className="chatScreen" ref={elemRef}>
                {chatMessages.map((msg) => (
                    <p key={msg.id}>{msg.chat_msg}</p>
                ))}
            </div>
            <textarea
                className="chatTypeLine"
                onKeyDown={(e) => keyCheck(e)}
            ></textarea>
        </div>
    );
}
