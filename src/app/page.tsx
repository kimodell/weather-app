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
    gust?: number; // Optional, since it's not present in this example
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

// Example usage:
const weatherData: WeatherData = {
  coord: {
    lon: -114.0853,
    lat: 51.0501
  },
  weather: [
    {
      id: 801,
      main: "Clouds",
      description: "few clouds",
      icon: "02d"
    }
  ],
  base: "stations",
  main: {
    temp: 295.81,
    feels_like: 295.33,
    temp_min: 294.59,
    temp_max: 296.34,
    pressure: 1021,
    humidity: 46,
    sea_level: 1021,
    grnd_level: 897
  },
  visibility: 10000,
  wind: {
    speed: 7.72,
    deg: 160
  },
  clouds: {
    all: 20
  },
  dt: 1725131739,
  sys: {
    type: 2,
    id: 2094668,
    country: "CA",
    sunrise: 1725108558,
    sunset: 1725157445
  },
  timezone: -21600,
  id: 5913490,
  name: "Calgary",
  cod: 200
};

export default function Home() {
  const { isLoading, error, data } = useQuery<WeatherData>(
    'repoData',
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=Calgary&APPID=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=2`
      );
      return data;
    }
  );

  const firstData = data?.list[0];

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
            <p>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}</p>
          </h2>
          <div></div>
        </div>
       </section>
      </main>
    </div>
  );
}
