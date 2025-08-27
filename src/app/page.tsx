import { loadData } from "@/lib/actions";
import { Home } from "@/components/home";
import { shuffleArray } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await loadData(0);
  const {shuffled, swaps} = shuffleArray(data);
  return <Home data={shuffled} swaps={swaps} />;
}