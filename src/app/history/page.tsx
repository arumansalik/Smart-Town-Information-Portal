import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ThiruppathurHeritage from "@/components/ThiruppathurHeritage";

export const metadata = {
  title: "History of Thiruppathur | Namma Ooru",
  description: "Explore Thiruppathur and Sivaganga's heritage, timeline, Marudhu Pandiyars and nearby landmarks.",
};

export default function HistoryPage() {
  return <main className="history-page">
    <Link href="/" className="history-back-link"><ArrowLeft size={15} /> Back to Namma Ooru</Link>
    <ThiruppathurHeritage />
  </main>;
}
