import { ResourceChunk, YouTubeChunkSchema } from "../types";
import { ZodSchema } from "./ZodSchema";
import {
  SQLiteVectorIndex,
  setupSQLiteDatabase,
} from "@modelfusion/sqlite-vss";
import { vectorDataFile } from "./filesystem";

const db = setupSQLiteDatabase(vectorDataFile);
export const vectorIndex = new SQLiteVectorIndex<ResourceChunk>({
  db,
  schema: new ZodSchema(YouTubeChunkSchema),
});
