import axios from "axios";

export function useFriendSubmit(
    otherUserId,
    boolean,
    buttonText,
    setButtonText,
    setBoolean
) {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (
            buttonText === "Cancel Friend Request" ||
            buttonText === "Unfriend"
        ) {
            axios
                .post("/friend-status-delete", { otherUserId })
                .then(({ data }) => {
                    console.log("DATA in Handlesubmit cancel/unfriend", data);
                    setButtonText("Make Friend");
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            axios
                .post("/friend-status/" + otherUserId, { boolean })
                .then(({ data }) => {
                    setBoolean(false);
                    console.log("DATA in Handlesubmit", data);
                    if (data.data.accepted) {
                        setButtonText("Unfriend");
                    } else if (!data.data) {
                        setButtonText("Make Friend");
                    } else {
                        setButtonText("Cancel Friend Request");
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };
    return [handleSubmit];
}
