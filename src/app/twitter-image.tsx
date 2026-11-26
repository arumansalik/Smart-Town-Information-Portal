
import { ImageResponse } from "next/og";
import ShareCard from "@/components/ShareCard";

export const runtime = "edge";

export const alt =
    "Namma TPR - Your town. All in one place.";

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default function TwitterImage() {
    return new ImageResponse(<ShareCard />, size);
}
