"use client";

import { useCallback, useEffect, useState } from "react";
import type { IconType } from "react-icons";
import {
  WiCloud,
  WiDayCloudy,
  WiDaySunny,
  WiFog,
  WiNightAltCloudy,
  WiNightClear,
  WiRain,
  WiShowers,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";

interface WeatherResponse {
  current: {
    temperature_2m: number;
    weather_code: number;
    is_day: number;
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

interface WeatherState {
  temperature: number;
  high: number;
  low: number;
  code: number;
  isDay: boolean;
}

const weatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=45.5017&longitude=-73.5673&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&timezone=America%2FToronto&forecast_days=1";

function weatherDetails(code: number, isDay: boolean): { label: string; Icon: IconType } {
  if (code === 0) return { label: "Clear", Icon: isDay ? WiDaySunny : WiNightClear };
  if (code === 1 || code === 2) return { label: "Partly Cloudy", Icon: isDay ? WiDayCloudy : WiNightAltCloudy };
  if (code === 3) return { label: "Cloudy", Icon: WiCloud };
  if (code === 45 || code === 48) return { label: "Foggy", Icon: WiFog };
  if ([51, 53, 55, 56, 57, 80, 81, 82].includes(code)) return { label: "Showers", Icon: WiShowers };
  if ([61, 63, 65, 66, 67].includes(code)) return { label: "Rain", Icon: WiRain };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: "Snow", Icon: WiSnow };
  if ([95, 96, 99].includes(code)) return { label: "Thunderstorm", Icon: WiThunderstorm };
  return { label: "Current Conditions", Icon: WiCloud };
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [error, setError] = useState(false);

  const loadWeather = useCallback(async () => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8_000);

    try {
      const response = await fetch(weatherUrl, { signal: controller.signal });
      if (!response.ok) throw new Error(`Weather request failed: ${response.status}`);
      const data = (await response.json()) as WeatherResponse;
      setWeather({
        temperature: Math.round(data.current.temperature_2m),
        high: Math.round(data.daily.temperature_2m_max[0]),
        low: Math.round(data.daily.temperature_2m_min[0]),
        code: data.current.weather_code,
        isDay: data.current.is_day === 1,
      });
      setError(false);
    } catch {
      setError(true);
    } finally {
      window.clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void loadWeather(), 0);
    const interval = window.setInterval(loadWeather, 10 * 60_000);
    window.addEventListener("focus", loadWeather);
    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(interval);
      window.removeEventListener("focus", loadWeather);
    };
  }, [loadWeather]);

  const details = weather ? weatherDetails(weather.code, weather.isDay) : null;
  const WeatherIcon = details?.Icon;

  return (
    <section className="glass-shine-card info-widget weather-widget" aria-label="Montréal weather">
      <div className="info-widget-meta">Weather · Montréal</div>
      {weather && details && WeatherIcon ? (
        <div className="weather-widget-content">
          <div>
            <div className="info-widget-value">{weather.temperature}°C</div>
            <div className="info-widget-meta">{details.label} · H{weather.high}° L{weather.low}°</div>
          </div>
          <WeatherIcon className="weather-widget-icon" aria-hidden="true" />
        </div>
      ) : (
        <div className="weather-widget-status">{error ? "Weather unavailable" : "Updating weather…"}</div>
      )}
    </section>
  );
}
