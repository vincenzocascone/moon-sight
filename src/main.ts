import "./style.scss";
// import { inject } from "@vercel/analytics";

import Experience from "./experience/Experience";

// inject analytics only if in production
if (process.env.NODE_ENV === "production") {
 // inject();
}
console.log(process.env.NODE_ENV)

Experience.getInstance();
