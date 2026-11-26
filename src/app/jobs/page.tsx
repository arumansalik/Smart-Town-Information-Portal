import type { Metadata } from "next";
import JobsBoard from "@/components/JobsBoard";

export const metadata: Metadata = {
  title: "Jobs in Tiruppattur",
  description:
      "Explore local job vacancies in Tiruppattur. Find full-time and part-time opportunities, company details and application information.",
  alternates: {
    canonical: "/jobs",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const dynamic = "force-dynamic";

export default function JobsPage() {
  return <JobsBoard />;
}