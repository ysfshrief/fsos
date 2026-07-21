'use client';

interface Props {
  lat: number;
  lng: number;
  height?: number;
}

/**
 * Live bus location map.
 * Uses Google Maps embed (no API key needed) centered on the bus coordinates.
 * When the driver shares location, lat/lng update and the map re-centers.
 */
export default function BusMap({ lat, lng, height = 320 }: Props) {
  // Google Maps embed without API key: q=lat,lng with output=embed
  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-100">
      <iframe
        key={`${lat}-${lng}`}
        src={src}
        style={{ height }}
        className="w-full border-0"
        loading="lazy"
        title="bus-location"
      />
    </div>
  );
}
