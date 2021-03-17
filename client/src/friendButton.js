import { useState, useEffect } from "react";
import axios from "axios";
import {useFriendSubmit} from "./hooks/useFriendSubmit";

export default function FriendButton({ otherUserId }) {
    const [buttonText, setButtonText] = useState();
    const [boolean, setBoolean] = useState(false);
    const [handleSubmit] = useFriendSubmit(
        otherUserId,
        boolean,
        buttonText,
    );

    useEffect(
        function () {
            axios.get("/friend-status/" + otherUserId).then(({ data }) => {
                console.log("useEffect in Button DATA", data);
                if (!data.data) {
                    setButtonText("Make Friend");
                    setBoolean(false);
                } else if (data.data && !data.data.accepted) {
                    setButtonText("Cancel Friend Request");
                } else if (data.data && data.data.accepted) {
                    setButtonText("Unfriend");
                    setBoolean(false)
                }
            });
        },
        []
    );

    console.log("params id in FRIEND BUTTON", otherUserId)
    return (
        <div placeholder="hello" className="friendButt" onClick={handleSubmit}>
            {buttonText}
        </div>
    );
};
