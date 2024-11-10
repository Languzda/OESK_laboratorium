import http from "k6/http";
import { check } from "k6";

export default function () {
  let res = http.get("https://jsonplaceholder.typicode.com/users");
  const users = JSON.parse(res.body);
  check(users, {
    "users count is 10": () => users.length === 10,
  });
}
