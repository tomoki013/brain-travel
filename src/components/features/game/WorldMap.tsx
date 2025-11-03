"use client";

import * as d3 from "d3";
import { feature } from "topojson-client";
import { useEffect, useRef, useState } from "react";
import type { FeatureCollection } from "geojson";
import type { Topology } from "topojson-specification";

type WorldMapProps = {
  startCountryId: string;
  goalCountryId: string;
  currentCountryId: string;
  routeHistoryIds: string[];
};

export const WorldMap = ({
  startCountryId,
  goalCountryId,
  currentCountryId,
  routeHistoryIds,
}: WorldMapProps) => {
  const ref = useRef<SVGSVGElement>(null);
  const [countries, setCountries] = useState<FeatureCollection | null>(null);

  // Load world map data
  useEffect(() => {
    const loadMapData = async () => {
      try {
        const worldAtlas = await d3.json<Topology>("/data/world.json");
        if (worldAtlas) {
          const geoJson = feature(
            worldAtlas,
            worldAtlas.objects.countries
          ) as FeatureCollection;
          setCountries(geoJson);
        }
      } catch (error) {
        console.error("Error loading map data:", error);
      }
    };
    loadMapData();
  }, []);

  // Draw the map and highlight countries
  useEffect(() => {
    if (!countries) return;

    const svg = d3.select(ref.current);
    const width = parseInt(svg.style("width"));
    const height = parseInt(svg.style("height"));

    const projection = d3.geoMercator().fitSize([width, height], countries);
    const path = d3.geoPath().projection(projection);

    svg
      .selectAll("path")
      .data(countries.features)
      .join("path")
      .attr("d", path)
      .attr("class", (d) => {
        const countryId = d.properties?.a3;
        if (countryId === startCountryId) {
          return "fill-sky-500 stroke-slate-700"; // Start country
        }
        if (countryId === goalCountryId) {
          return "fill-red-500 stroke-slate-700"; // Goal country
        }
        if (countryId === currentCountryId) {
          return "fill-yellow-400 stroke-slate-700"; // Current country
        }
        if (routeHistoryIds.includes(countryId)) {
          return "fill-sky-300 stroke-slate-700"; // Route history
        }
        return "fill-slate-200 stroke-slate-700"; // Default
      });
  }, [
    countries,
    startCountryId,
    goalCountryId,
    currentCountryId,
    routeHistoryIds,
  ]);

  return <svg ref={ref} className="w-full h-full" />;
};
