import "./style.scss";

import Experience from "./experience/Experience";

if (process.env.NODE_ENV === "production") {
    import("@vercel/analytics")
        .then(({ inject }) => {
            inject();
        })
        .catch((error) => console.error("Failed to load vercel analytics:", error));
}

Experience.getInstance();
