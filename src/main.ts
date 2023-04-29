import "./style.scss";
import { inject } from "@vercel/analytics";

import Experience from "./experience/Experience";

inject();

Experience.getInstance();
