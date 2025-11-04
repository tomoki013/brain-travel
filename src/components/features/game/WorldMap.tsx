"use client";

import * as d3 from "d3";
import { feature } from "topojson-client";
import { useEffect, useRef, useState } from "react";
import type { FeatureCollection } from "geojson";
import type { Topology } from "topojson-specification";
import { a3ToNumericId } from "@/lib/hooks/useCountryData";

type WorldMapProps = {
  startCountryId: string;
  goalCountryId: string;
  currentCountryId: string;
  routeHistoryIds: string[];
  selectedCountryId: string | null;
};

export const WorldMap = ({
  startCountryId,
  goalCountryId,
  currentCountryId,
  routeHistoryIds,
  selectedCountryId,
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
    if (!countries || !ref.current) return;

    const svg = d3.select(ref.current);
    // Clear SVG content before redrawing to avoid layering issues
    svg.selectAll("*").remove();

    const g = svg.append("g"); // Group to apply transform for zoom/pan

    const width = parseInt(svg.style("width"));
    const height = parseInt(svg.style("height"));

    const projection = d3.geoMercator().fitSize([width, height], countries);
    const path = d3.geoPath().projection(projection);

    const startNumericId = a3ToNumericId[startCountryId];
    const goalNumericId = a3ToNumericId[goalCountryId];
    const currentNumericId = a3ToNumericId[currentCountryId];
    const selectedNumericId = selectedCountryId
      ? a3ToNumericId[selectedCountryId]
      : null;
    const routeHistoryNumericIds = routeHistoryIds.map(
      (id) => a3ToNumericId[id]
    );

    g.selectAll("path")
      .data(countries.features)
      .join("path")
      .attr("d", path)
      .attr("class", (d) => {
        const countryNumericId = d.id;
        const baseClasses = "stroke-white/20 stroke-1 transition-colors";

        // Highest priority: Goal, Start, Current
        if (countryNumericId === goalNumericId) {
          return `fill-rose-500 ${baseClasses}`; // Goal
        }
        if (countryNumericId === startNumericId) {
          return `fill-emerald-500 ${baseClasses}`; // Start
        }
        if (countryNumericId === currentNumericId) {
          return `fill-yellow-400 ${baseClasses}`; // Current
        }
        // Lower priority: Selected, History
        if (countryNumericId === selectedNumericId) {
          return `fill-cyan-400 ${baseClasses}`; // Selected
        }
        if (routeHistoryNumericIds.includes(countryNumericId as string)) {
          return `fill-emerald-300/70 ${baseClasses}`; // History
        }
        // Default
        return `fill-gray-500/50 ${baseClasses}`;
      });

    // Zoom functionality
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);
  }, [
    countries,
    startCountryId,
    goalCountryId,
    currentCountryId,
    routeHistoryIds,
    selectedCountryId,
  ]);

  return <svg ref={ref} className="w-full h-full" />;
};
