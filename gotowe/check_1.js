import http from "k6/http";
import { check } from "k6";

export default function () {
  let res = http.get("https://google.com");
  check(res, {
    "status was 200": (r) => r.status === 200,
    "response time < 300ms": (r) => r.timings.duration < 300,
    "response body contain 'Google'": (r) => r.body.includes("Google"),
  });
}
