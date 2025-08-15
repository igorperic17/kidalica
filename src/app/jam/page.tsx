import { getAllSongs } from "@/lib/songs.server";
import JamClient from "./JamClient";

export const dynamic = "force-static";

export default function JamPage() {
  const initialSongs = getAllSongs();
  return <JamClient initialSongs={initialSongs} />;
}


