import { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople({ showProfile }) {
    const [searchTerm, setSearchTerm] = useState();
    const [preUsers, setPreUsers] = useState();
    const [users, setUsers] = useState();

    useEffect(function () {
        axios.get("/users/most-recent").then(({ data }) => {
            setPreUsers(data.data);
        });
    }, []);

    useEffect(
        function () {
            axios
                .get("/findPeople/" + searchTerm)
                .then(({ data }) => {
                    if (data) {
                        setUsers(data.data);
                    }
                })
                .catch((err) => {
                    console.log("err in axios App User POST Request : ", err);
                });
        },
        [searchTerm]
    );

    function changeHandler({ target }) {
        setSearchTerm(target.value);
        console.log(target.value);
    }

    return (
        <div className="peopleSearch">
            <div>
                Search ➲
                <input
                    defaultValue={searchTerm}
                    onChange={changeHandler}
                ></input>
            </div>
            {!users && (
                <div className="preview">
                    <h2>Latest</h2>
                    {preUsers &&
                        preUsers.map(function (data) {
                            return (
                                <div className="preview" key={data.id}>
                                    <Link to={`/user/${data.id}`}>
                                        <img
                                            alt={`${data.firstname} ${data.lastname}`}
                                            src={data.img_url}
                                            onClick={(arg) => showProfile(true)}
                                        />
                                    </Link>
                                    {data.firstname} {data.lastname}
                                </div>
                            );
                        })}
                </div>
            )}
            {users && (
                <div className="preview">
                    <div className="results">
                        {users &&
                            users.map(function (data) {
                                return (
                                    <div className="preview" key={data.id}>
                                        <Link to={`/user/${data.id}`}>
                                            <img
                                                alt={`${data.firstname} ${data.lastname}`}
                                                src={data.img_url}
                                            />
                                        </Link>
                                        {data.firstname} {data.lastname}
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}
        </div>
    );
}
