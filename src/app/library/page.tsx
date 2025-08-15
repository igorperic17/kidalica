import { getAllSongs } from "@/lib/songs.server";
import LibraryClient from "./LibraryClient";

export const dynamic = "force-static";

export default function LibraryPage() {
  const initialSongs = getAllSongs();
  return <LibraryClient initialSongs={initialSongs} />;
}


