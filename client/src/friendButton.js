import { useState, useEffect } from "react";
import axios from "axios";
import { useFriendSubmit } from "./hooks/useFriendSubmit";

export default function FriendButton({ otherUserId }) {
    const [buttonText, setButtonText] = useState();
    const [boolean, setBoolean] = useState(false);
    const [handleSubmit] = useFriendSubmit(
        otherUserId,
        boolean,
        buttonText,
        setButtonText,
        setBoolean
    );

    useEffect(function () {
        axios.get("/friend-status/" + otherUserId).then(({ data }) => {
            console.log("useEffect in Button DATA", data);
            setButtonText("HELP");
            if (!data.data) {
                setButtonText("Make Friend");
            } else if (!data.data.accepted) {
                if (data.loggedUser === data.data.sender_id) {
                    setButtonText("Cancel Friend Request");
                } else {
                    setButtonText("Accept Friend Request");
                    setBoolean(true);
                }
            } else if (data.data.accepted) {
                setButtonText("Unfriend");
            }
        });
    }, []);

    return (
        <div className="friendButt" onClick={handleSubmit}>
            {buttonText}
        </div>
    );
}
