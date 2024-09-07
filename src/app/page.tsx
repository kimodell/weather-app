'use client';

import Image from "next/image";
import Navbar from "./components/Navbar";
import { useQuery } from "react-query";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import Container from "./components/Container";
import { convertKelvinToCelsius } from "./utils/convertKelvinToCelsius";
import WeatherIcon from "./components/WeatherIcon";
import { getDayOrNightIcon } from "./utils/getDayOrNightIcon";
import WeatherDetails from "./components/WeatherDetails";
import { metersToKilometers } from "./utils/metersToKilometers";
import { convertWindSpeed } from "./utils/convertWindSpeed";


type WeatherData = {
  cod: string;
  message: number;
  cnt: number;
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    visibility: number;
    pop: number;
    sys: {
      pod: string;
    };
    dt_txt: string;
  }>;
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
};

export default function Home() {

  const { isLoading, error, data } = useQuery<WeatherData>(
    'weatherData',
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=calgary&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    }
  );

  const todaysData = data?.list[0];

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

        {/* todays data */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="flex gap-1 text-2xl text 2xl items-end">
              {/*Display day of the week from data. Convert to date object from string, display empty string if date is null or undefined, else display date in full name format */}
              <p>{format(parseISO(todaysData?.dt_txt ?? ""), "EEEE")}</p>
              <p className="text-lg">({format(parseISO(todaysData?.dt_txt ?? ""), "dd.MM.yyy")})</p>
            </h2>
            <Container className="gap=10 px-6 items-center">
              {/* temperature */}
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {/*Use helped function to display converted temp, if temp null or undefined, display default temp*/}
                  {convertKelvinToCelsius(todaysData?.main.temp ?? 302.17)}°
                </span>
                <p className="text-xs space-a-1 whitespace-nowrap">
                  <span>Feels like: </span>
                  <span>
                    {convertKelvinToCelsius(todaysData?.main.feels_like ?? 0)}°
                  </span>
                </p>
                <p className="text-xs space-x-2">
                  <span>
                    {convertKelvinToCelsius(todaysData?.main.temp_min ?? 0)}
                    °↓{" "}
                  </span>
                  <span>
                    {" "}
                    {convertKelvinToCelsius(todaysData?.main.temp_max ?? 0)}
                    °↑
                  </span>
                </p>
              </div>
              {/* time and weather icons */}
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data?.list.map((data, index) =>
                  <div
                    key={index}
                    className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                  >
                    {/*Display time from data. Convert to time object from string */}
                    <p className="whitespace-nowrap">
                      {format(parseISO(data.dt_txt), "h:mm a")}
                    </p>

                    {/*<WeatherIcon iconName={data.weather[0].icon}/>*/}
                    <WeatherIcon iconName={getDayOrNightIcon(data.weather[0].icon, data.dt_txt)} />

                    <p>
                      {convertKelvinToCelsius(data?.main.temp ?? 0)}°
                    </p>
                  </div>
                )}
              </div>
            </Container>
          </div>
          <div className="flex gap-4">
            {/* left */}
            <Container className="w-fit justify-center flex-col px-4 items-center">
              <p className="capitalize text-center">
                {todaysData?.weather[0].description}{" "}
              </p>
              <WeatherIcon
                iconName={getDayOrNightIcon(
                  todaysData?.weather[0].icon ?? "",
                  todaysData?.dt_txt ?? ""
                )}
              />
            </Container>
            {/* right */}
            <Container className="bg-blue-200/80  px-6 gap-4 justify-between overflow-x-auto">
              <WeatherDetails
                visibility={metersToKilometers(todaysData?.visibility ?? 10000)}
                humidity={`${todaysData?.main.humidity}%`}
                windSpeed={convertWindSpeed(todaysData?.wind.speed ?? 1.64)}
                airPressure={`${todaysData?.main.pressure} hPa`}
                sunrise={format(fromUnixTime(data?.city.sunrise ?? 1725714010), "H:mm")}
                sunset={format(fromUnixTime(data?.city.sunset ?? 1725761311), "H:mm")}
              />
            </Container>

          </div>
        </section>

        {/*7 day forecast data */}
        <section className="flex w-full fox-col gap-4">
          <p className="text=2xl">7-day Forecast</p>

        </section>
      </main>
    </div>
  );
}
