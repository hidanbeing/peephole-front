import setCookie from "./setCookie";

export default function deleteCookie(name) {
  setCookie(name, "", {
    "max-age": -1,
  });
}
