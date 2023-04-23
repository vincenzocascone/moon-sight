import { Source } from "./utils/ResourcesManager";

export default [
  {
    name: "moonColorTexture",
    type: "texture",
    path: "src/assets/textures/moon/moon-color.jpg",
  },
  {
    name: "moonBumpTexture",
    type: "texture",
    path: "src/assets/textures/moon/moon-bump.jpg",
  },
  {
    name: "text",
    type: "font",
    path: "src/assets/fonts/play-regular.json",
  },
  {
    name: "textMatcap",
    type: "texture",
    path: "src/assets/matcaps/text-matcap.png",
  },
] as Source[];
