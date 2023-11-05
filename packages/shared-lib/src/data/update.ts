import { downloadTranscripts } from "./downloadTranscripts";
import { embedTranscripts } from "./embedTranscripts";

(async () => {
  await downloadTranscripts();
  await embedTranscripts();
})();
