import { Suspense } from "react";
import SearchContent from "./SearchContent";

export default function SearchPage() {
    return (
        <Suspense
            fallback={
                <div className="mx-auto max-w-[920px] py-12 text-center">
                    Loading search...
                </div>
            }
        >
            <SearchContent />
        </Suspense>
    );
}