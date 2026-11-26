
import JobsBoard from "@/components/JobsBoard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jobs in Tiruppattur",
  description:
      "Explore local job vacancies in Tiruppattur. Find full-time and part-time opportunities, employer details and application information.",

  alternates: {
    canonical: "/jobs",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function JobsPage() {
  return (
      <>
        <section className="mx-auto w-full max-w-6xl px-4 pt-6 pb-2">
          <h2 className="text-xl font-semibold">
            Find Local Jobs in Tiruppattur
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
            Discover employment opportunities from local businesses
            and employers in Tiruppattur. Browse full-time and part-time
            vacancies, check job descriptions and find application details.
            New approved opportunities are added as they become available.
          </p>
        </section>

        <JobsBoard />
      </>
  );
}
