import { Link } from "react-router-dom";

export default function DeleteAccount({ removeAllData }) {
    return (
        <div class="deleteContainer">
            Delete Account
            <div className="deleteInfo">This will entirely delete your account and all your collected personal data.</div>
            <span>
                Are you sure?
                <p onClick={() => removeAllData()}>yes</p>
                <Link to="/">
                    <div>back</div>
                </Link>
            </span>
        </div>
    );
    
}


