import type { Source } from "./utils/ResourcesManager";

export default [
  {
    name: "moonColorTexture",
    type: "texture",
    path: "/textures/moon/moon-color.jpg",
  },
  {
    name: "moonBumpTexture",
    type: "texture",
    path: "/textures/moon/moon-bump.jpg",
  },
  {
    name: "text",
    type: "font",
    path: "/fonts/play-regular.json",
  },
  {
    name: "textMatcap",
    type: "texture",
    path: "/matcaps/text-matcap.png",
  },
] as Source[];
