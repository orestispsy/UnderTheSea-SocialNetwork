import Registration from "./registration";

export default function Welcome() {
    return (
        <div>
            <h1 className="welcome">
                <div className="bubbles"></div>
                Welcome
                <span>Under the Surface</span>
            </h1>
            <Registration />
        </div>
    );
}
