import util from "./util/event-util";
import parser from "./parser";
import "./assets/main.css";

function Calc() {
  const el = document.querySelector("#expr");
  el.addEventListener(
    "keyup",
    (e) => {
      if (util.isEnter(e)) {
        const res = parser(e.target.value);
        console.log(res);
      }
    },
    false
  );
}

Calc();
