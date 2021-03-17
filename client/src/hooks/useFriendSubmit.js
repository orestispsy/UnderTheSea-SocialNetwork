import { useState } from "react";
import axios from "axios";

export function useFriendSubmit(otherUserId, boolean, buttonText) {
    console.log("MEEEEEEEEEEEEEEN", buttonText);
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("searching?",otherUserId, boolean, buttonText);
        if (buttonText === "Cancel Friend Request") {
            console.log("yes it is");
            axios
                .post("/friend-status-delete", {otherUserId})
                .then(({ data }) => {
                    console.log("TAKE IT MEN", data);
                })
                .catch((err) => {
                    console.log(`error in axios post`, err);
                });
        } else {
            axios
                .post("/friend-status/" + otherUserId, boolean)
                .then(({ data }) => {
                    console.log("TAKE IT MEN", data);
                })
                .catch((err) => {
                    console.log(`error in axios post ${otherUserId}:`, err);
                });
        }
    };
    return [handleSubmit];
}