import HomeDashboard from "@/components/HomeDashboard";
import { getWeather } from "@/lib/weather";

export default async function Home() {
  let weather = null;
  try {
    weather = await getWeather();
  } catch {
    // Keep the town dashboard useful when the weather service is unavailable.
  }

  return <HomeDashboard weather={weather} />;
}
