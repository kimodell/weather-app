'use client';

import Image from "next/image";
import Navbar from "./components/Navbar";
import { useQuery } from "react-query";
import axios from "axios";
import { format, parseISO } from "date-fns";


interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}


export default function Home() {
  
  const { isLoading, error, data } = useQuery<WeatherData>(
    'weatherData',
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=calgary&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`
      );
      return data;
    }
  );

  //const firstData = data?.list[0];

  console.log("data:", data);


  if (isLoading) return (
    <div className="flex items-center min-h-screen justify-center">
      <p className="animate-bounce">
        Loading...      
      </p>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar />
      <main className="px-3 max-w-7xl mx-auto flax flex-col gap-9 w-full pb-10 pt-4">
       <section>
        <div>
          <h2 className="flex gap-1 text-2xl text 2xl items-end">
            {/*<p>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}</p>*/}
          </h2>
          <div></div>
        </div>
       </section>
      </main>
    </div>
  );
}
