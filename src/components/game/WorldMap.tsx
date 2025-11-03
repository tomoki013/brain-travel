'use client';

import * as d3 from 'd3';
import { feature } from 'topojson-client';
import { useEffect, useRef, useState } from 'react';
import type { FeatureCollection } from 'geojson';
import type { Topology } from 'topojson-client';

// highlightする国を string[] で受け取る
type WorldMapProps = {
  startCountry: string; // JPN
  goalCountry: string; // FRA
};

// WorldMap コンポーネント
export const WorldMap = ({ startCountry, goalCountry }: WorldMapProps) => {
  const ref = useRef<SVGSVGElement>(null);
  const [countries, setCountries] = useState<FeatureCollection | null>(null);

  // world.json を非同期で読み込む
  useEffect(() => {
    const loadMapData = async () => {
      try {
        const worldAtlas = await d3.json<Topology>('/data/world.json');
        if (worldAtlas) {
          const geoJson = feature(
            worldAtlas,
            worldAtlas.objects.countries,
          ) as FeatureCollection;
          setCountries(geoJson);
        }
      } catch (error) {
        console.error('Error loading map data:', error);
      }
    };
    loadMapData();
  }, []);

  // 地図を描画する
  useEffect(() => {
    if (!countries) return;

    const svg = d3.select(ref.current);
    const width = parseInt(svg.style('width'));
    const height = parseInt(svg.style('height'));

    const projection = d3.geoMercator().fitSize([width, height], countries);
    const path = d3.geoPath().projection(projection);

    svg
      .selectAll('path')
      .data(countries.features)
      .join('path')
      .attr('d', path)
      .attr('class', (d) => {
        const countryId = d.properties?.a3;
        if (countryId === startCountry) {
          return 'fill-sky-500 stroke-slate-700';
        }
        if (countryId === goalCountry) {
          return 'fill-red-500 stroke-slate-700';
        }
        return 'fill-slate-200 stroke-slate-700';
      });
  }, [countries, startCountry, goalCountry]);

  return <svg ref={ref} className="w-full h-full" />;
};
