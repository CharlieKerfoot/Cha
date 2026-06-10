<script lang="ts">
  import { onMount } from 'svelte';

  interface ShopPin {
    id: string;
    name: string;
    lat: number;
    lng: number;
    website?: string;
    label?: string;
  }

  let {
    center,
    radiusMiles = 0,
    shops
  }: {
    center: { lat: number; lng: number };
    radiusMiles?: number;
    shops: ShopPin[];
  } = $props();

  const MILES_TO_METERS = 1609.34;

  let mapEl: HTMLDivElement;
  let map: any = null;

  function escapeHtml(s: string): string {
    return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  }

  onMount(() => {
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');
      if (cancelled) return;

      map = L.map(mapEl, { attributionControl: false }).setView([center.lat, center.lng], 13);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
      L.control.attribution({ prefix: false }).addAttribution('© OpenStreetMap').addTo(map);

      const youIcon = L.divIcon({
        className: 'cha-pin',
        html: '<div class="dot"></div>',
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });
      L.marker([center.lat, center.lng], { icon: youIcon }).addTo(map).bindPopup('You');

      let circle = null;
      if (radiusMiles > 0) {
        circle = L.circle([center.lat, center.lng], {
          radius: radiusMiles * MILES_TO_METERS,
          color: '#E8442E',
          weight: 1.5,
          fillColor: '#E8442E',
          fillOpacity: 0.05
        }).addTo(map);
      }

      const markers = shops.map((shop) => {
        const m = L.circleMarker([shop.lat, shop.lng], {
          radius: 8,
          color: '#1C1B17',
          weight: 1.5,
          fillColor: '#FFB3C7',
          fillOpacity: 1
        }).addTo(map);
        const name = escapeHtml(shop.name);
        const label = shop.label ? `<div class="meta-mono">${escapeHtml(shop.label)}</div>` : '';
        const site = shop.website
          ? `<div><a href="${escapeHtml(shop.website)}" target="_blank" rel="noopener noreferrer">Website ↗</a></div>`
          : '';
        m.bindPopup(`<strong>${name}</strong>${label}${site}`);
        return m;
      });

      if (circle) {
        map.fitBounds(circle.getBounds(), { padding: [10, 10] });
      } else if (markers.length > 0) {
        map.fitBounds(L.featureGroup(markers).getBounds().pad(0.3));
      }
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  });
</script>

<div class="map" bind:this={mapEl}></div>

<style>
  .map {
    height: 320px;
    width: 100%;
  }
</style>
