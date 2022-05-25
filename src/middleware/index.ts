import { Router } from "vue-router";
import loginGuard from "./login";
import setTitle from "./set-title";
export default function (router: Router) {
  loginGuard(router);
  setTitle(router);
}
