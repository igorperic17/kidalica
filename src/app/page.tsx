import { getAllSongs } from "@/lib/songs.server";
import HomeClient from "./HomeClient";

export default function HomePage() {
  const songs = getAllSongs();
  return <HomeClient songs={songs} />;
}


