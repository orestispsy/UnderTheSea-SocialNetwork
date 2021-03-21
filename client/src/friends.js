import { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { receiveUsers, acceptRequest, unFriend } from "./actions";

export default function Friends({ id, showProfile }) {
    const dispatch = useDispatch();
    const requests = useSelector(
        (state) =>
            state.users &&
            state.users.filter(
                (user) => user.sender_id == id && user.accepted !== true
            )
    );

    const wannabes = useSelector(
        (state) =>
            state.users &&
            state.users.filter(
                (user) => user.sender_id !== id && user.accepted !== true
            )
    );

    const friends = useSelector(
        (state) =>
            state.users && state.users.filter((user) => user.accepted == true)
    );

    useEffect(() => {
        dispatch(receiveUsers());
    }, []);

    if (!requests) {
        return null;
    }

    return (
        <div className="friendTab">
            <div className="friendsCardsBack">
                <h1>
                    Pending <br></br>Requests
                    <br></br>
                    <span>Total: {requests.length}</span>
                </h1>
                <div className="friendsCards">
                    {requests.map((user) => (
                        <div className="pendingFriends" key={user.id}>
                            <p>
                                {user.firstname}
                                <br></br>
                                {user.lastname}
                            </p>
                            <Link
                                to={`/user/${user.id}`}
                                onClick={(arg) => showProfile(true)}
                            >
                                <img src={user.img_url}></img>
                            </Link>
                            <div className="buttons">
                                <button
                                    onClick={(arg) =>
                                        dispatch(unFriend(user.id))
                                    }
                                >
                                    cancel
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="friendsCardsBack">
                <h1>
                    Incoming <br></br>Requests
                    <br></br>
                    <span>Total: {wannabes.length}</span>
                </h1>
                <div className="friendsCards">
                    {wannabes.map((user) => (
                        <div className="wannabes" key={user.id}>
                            <p>
                                {user.firstname}
                                <br></br>
                                {user.lastname}
                            </p>
                            <Link
                                to={`/user/${user.id}`}
                                onClick={(arg) => showProfile(true)}
                            >
                                <img src={user.img_url}></img>
                            </Link>
                            <div className="buttons">
                                <button
                                    onClick={(arg) =>
                                        dispatch(acceptRequest(user.id))
                                    }
                                >
                                    accept
                                </button>
                                <button
                                    onClick={(arg) =>
                                        dispatch(unFriend(user.id))
                                    }
                                >
                                    deny
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="friendsCardsBack">
                <h1>
                    Your <br></br>Friends
                    <br></br>
                    <span>Total: {friends.length}</span>
                </h1>
                <div className="friendsCards">
                    {friends.map((user) => (
                        <div className="trueFriends" key={user.id}>
                            <p>
                                {user.firstname}
                                <br></br>
                                {user.lastname}
                            </p>
                            <Link
                                to={`/user/${user.id}`}
                                onClick={(arg) => showProfile(true)}
                            >
                                <img src={user.img_url}></img>
                            </Link>
                            <div className="buttons">
                                <button
                                    onClick={(arg) =>
                                        dispatch(unFriend(user.id))
                                    }
                                >
                                    Unfriend
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
