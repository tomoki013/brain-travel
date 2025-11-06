"use client";

import * as d3 from "d3";
import { feature } from "topojson-client";
import { useEffect, useRef, useState, useMemo } from "react";
import type { Feature, FeatureCollection } from "geojson";
import type { Topology } from "topojson-specification";
import { a3ToNumericId } from "@/lib/data/country-codes";

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
  const projectionRef = useRef<d3.GeoProjection | null>(null);
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

  const getCountryFeature = (countryId: string): Feature | undefined => {
    if (!countries) return undefined;
    const numericId = a3ToNumericId[countryId];
    return countries.features.find((f) => f.id === numericId);
  };

  useEffect(() => {
    if (!countries || !ref.current) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear previous render

    const width = parseInt(svg.style("width"));
    const height = parseInt(svg.style("height"));

    const projection = d3
      .geoOrthographic()
      .fitSize([width, height], { type: "Sphere" })
      .translate([width / 2, height / 2]);

    projectionRef.current = projection; // Store projection in ref

    const path = d3.geoPath().projection(projection);

    const g = svg.append("g");

    g.append("path")
      .datum({ type: "Sphere" } as any)
      .attr("d", path)
      .attr("class", "fill-gray-900");

    g.append("g")
      .attr("class", "countries") // Add a class for easy selection
      .selectAll("path")
      .data(countries.features)
      .join("path")
      .attr("d", path)
      .attr("class", "stroke-black stroke-[0.5px] fill-gray-300");

    const initialScale = projection.scale();
    const drag = d3.drag<SVGSVGElement, unknown>().on("drag", (event) => {
      const rotate = projection.rotate();
      const k = 75 / projection.scale();
      projection.rotate([rotate[0] + event.dx * k, rotate[1] - event.dy * k]);
      path.projection(projection);
      g.selectAll("path").attr("d", path as any);
    });

    const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([1, 10]).on("zoom", (event) => {
      projection.scale(initialScale * event.transform.k);
      path.projection(projection);
      g.selectAll("path").attr("d", path as any);
    });

    svg.call(drag).call(zoom);
  }, [countries]);

  // Update country colors
  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);

    const startNumericId = a3ToNumericId[startCountryId];
    const goalNumericId = a3ToNumericId[goalCountryId];
    const currentNumericId = a3ToNumericId[currentCountryId];
    const selectedNumericId = selectedCountryId ? a3ToNumericId[selectedCountryId] : null;
    const routeHistoryNumericIds = routeHistoryIds.map((id) => a3ToNumericId[id]);

    svg.select("g > .countries").selectAll("path").attr("class", (d: any) => {
      const countryNumericId = d.id;
      const baseClasses = "stroke-black stroke-[0.5px] transition-colors duration-300";
      if (countryNumericId === goalNumericId) return `fill-rose-500 ${baseClasses}`;
      if (countryNumericId === startNumericId) return `fill-emerald-400 ${baseClasses}`;
      if (countryNumericId === currentNumericId) return `fill-amber-400 ${baseClasses}`;
      if (countryNumericId === selectedNumericId) return `fill-sky-400 ${baseClasses}`;
      if (routeHistoryNumericIds.includes(countryNumericId as string)) return `fill-emerald-400/50 ${baseClasses}`;
      return `fill-gray-300 hover:fill-gray-400 ${baseClasses}`;
    });
  }, [startCountryId, goalCountryId, currentCountryId, routeHistoryIds, selectedCountryId]);

  // Handle initial rotation (start/goal)
  useEffect(() => {
    if (!countries || !projectionRef.current) return;
    const projection = projectionRef.current;

    const startFeature = getCountryFeature(startCountryId);
    const goalFeature = getCountryFeature(goalCountryId);

    if (startFeature && goalFeature) {
      const center = d3.geoCentroid({
        type: "FeatureCollection",
        features: [startFeature, goalFeature],
      });
      projection.rotate([-center[0], -center[1]]);

      const svg = d3.select(ref.current);
      const path = d3.geoPath().projection(projection);
      svg.selectAll("g path").attr("d", path as any);
    }
  }, [countries, startCountryId, goalCountryId]);

  // Handle animated rotation (current country)
  useEffect(() => {
    if (!countries || !projectionRef.current || currentCountryId === startCountryId) return;

    const projection = projectionRef.current;
    const countryFeature = getCountryFeature(currentCountryId);

    if (countryFeature) {
      const center = d3.geoCentroid(countryFeature);
      const svg = d3.select(ref.current);
      const path = d3.geoPath().projection(projection);

      d3.transition()
        .duration(1000)
        .tween("rotate", () => {
          const r = d3.interpolate(projection.rotate(), [-center[0], -center[1]]);
          return (t) => {
            projection.rotate(r(t) as [number, number]);
            svg.selectAll("g path").attr("d", path as any);
          };
        });
    }
  }, [countries, currentCountryId, startCountryId]);

  return <svg ref={ref} className="w-full h-full rounded-lg bg-black" />;
};
