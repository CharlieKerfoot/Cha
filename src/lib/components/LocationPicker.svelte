<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { SF_CENTER } from '$lib/geo';

  let {
    lat = $bindable(SF_CENTER.lat),
    lng = $bindable(SF_CENTER.lng),
    radiusMiles = 3,
    showRadius = true
  }: {
    lat?: number;
    lng?: number;
    radiusMiles?: number;
    showRadius?: boolean;
  } = $props();

  const MILES_TO_METERS = 1609.34;

  let mapEl: HTMLDivElement;
  let map: any = null;
  let marker: any = null;
  let circle: any = null;

  onMount(() => {
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');
      if (cancelled) return;

      map = L.map(mapEl, { attributionControl: false }).setView([lat, lng], 13);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
      L.control.attribution({ prefix: false }).addAttribution('© OpenStreetMap').addTo(map);

      const icon = L.divIcon({
        className: 'cha-pin',
        html: '<div class="dot"></div>',
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });
      marker = L.marker([lat, lng], { draggable: true, icon }).addTo(map);
      marker.on('drag', () => {
        const p = marker.getLatLng();
        lat = p.lat;
        lng = p.lng;
      });
      map.on('click', (e: any) => {
        marker.setLatLng(e.latlng);
        lat = e.latlng.lat;
        lng = e.latlng.lng;
      });

      if (untrack(() => showRadius)) {
        circle = L.circle([lat, lng], {
          radius: untrack(() => radiusMiles) * MILES_TO_METERS,
          color: '#E8442E',
          weight: 1.5,
          fillColor: '#E8442E',
          fillOpacity: 0.07
        }).addTo(map);
      }
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  });

  $effect(() => {
    if (circle) {
      circle.setLatLng([lat, lng]);
      circle.setRadius(radiusMiles * MILES_TO_METERS);
    }
  });

  // External prefill (e.g. picking a shop from the directory) moves the pin.
  $effect(() => {
    if (marker && map) {
      const p = marker.getLatLng();
      if (Math.abs(p.lat - lat) > 1e-6 || Math.abs(p.lng - lng) > 1e-6) {
        marker.setLatLng([lat, lng]);
        map.panTo([lat, lng]);
      }
    }
  });
</script>

<div class="map" bind:this={mapEl}></div>
<input type="hidden" name="lat" value={lat} />
<input type="hidden" name="lng" value={lng} />
<p class="meta-mono hint">Drag the pin or tap the map to set your spot</p>

<style>
  .map {
    height: 280px;
    width: 100%;
  }

  .hint {
    margin: 0.4rem 0 0;
  }
</style>
