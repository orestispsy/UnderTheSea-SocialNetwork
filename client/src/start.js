import ReactDOM from "react-dom";
import Welcome from "./welcome";


let elem;
if (location.pathname === "/welcome") {
    elem = <Welcome />;
}

else {
    elem = <p className="startScreen">Under The Sea</p>;
}

ReactDOM.render(elem, document.querySelector("main"));
