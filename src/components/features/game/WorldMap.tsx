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

  useEffect(() => {
    if (!countries || !ref.current) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const g = svg.append("g");

    const width = parseInt(svg.style("width"));
    const height = parseInt(svg.style("height"));

    const projection = d3
      .geoOrthographic()
      .fitSize([width, height], { type: "Sphere" })
      .center([0, 0])
      .translate([width / 2, height / 2]);
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

    g.append("path")
      .datum({ type: "Sphere" } as any)
      .attr("d", path)
      .attr("class", "fill-gray-900");

    g.append("g")
      .selectAll("path")
      .data(countries.features)
      .join("path")
      .attr("d", path)
      .attr("class", (d) => {
        const countryNumericId = d.id;
        const baseClasses =
          "stroke-black stroke-[0.5px] transition-colors duration-300";

        if (countryNumericId === goalNumericId) {
          return `fill-rose-500 ${baseClasses}`;
        }
        if (countryNumericId === startNumericId) {
          return `fill-emerald-400 ${baseClasses}`;
        }
        if (countryNumericId === currentNumericId) {
          return `fill-amber-400 ${baseClasses}`;
        }
        if (countryNumericId === selectedNumericId) {
          return `fill-sky-400 ${baseClasses}`;
        }
        if (routeHistoryNumericIds.includes(countryNumericId as string)) {
          return `fill-emerald-400/50 ${baseClasses}`;
        }
        return `fill-gray-300 hover:fill-gray-400 ${baseClasses}`;
      });

    const initialScale = projection.scale();

    const drag = d3
      .drag<SVGSVGElement, unknown>()
      .on("drag", (event) => {
        const rotate = projection.rotate();
        const k = 75 / projection.scale();
        projection.rotate([rotate[0] + event.dx * k, rotate[1] - event.dy * k]);
        path.projection(projection);
        g.selectAll("path").attr("d", path as any);
      });

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 10])
      .on("zoom", (event) => {
        projection.scale(initialScale * event.transform.k);
        path.projection(projection);
        g.selectAll("path").attr("d", path as any);
      });

    svg.call(drag).call(zoom);
  }, [
    countries,
    startCountryId,
    goalCountryId,
    currentCountryId,
    routeHistoryIds,
    selectedCountryId,
  ]);

  return <svg ref={ref} className="w-full h-full rounded-lg bg-black" />;
};
