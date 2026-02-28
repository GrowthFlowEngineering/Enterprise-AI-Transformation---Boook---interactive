import type { ChapterSystemModule } from "../types";
import ChapterOneSystem from "./ChapterOneSystem";

const chapter01Module: ChapterSystemModule = {
  status: "ready",
  Component: ChapterOneSystem,
};

export default chapter01Module;
