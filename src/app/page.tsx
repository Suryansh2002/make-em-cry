import { loadData } from "@/lib/actions";
import { Home } from "@/components/home";

export default async function Page() {
  const data = await loadData(0);
  return <Home data={data} />;
}