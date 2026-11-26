
import { ImageResponse } from "next/og";
import ShareCard from "@/components/ShareCard";

export const runtime = "edge";

export const alt =
    "Namma TPR - Local jobs, shops and services in Tiruppattur";

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
    return new ImageResponse(<ShareCard />, size);
}
