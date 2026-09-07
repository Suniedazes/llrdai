# Rotating Earth textures

Downloaded September 7, 2026 from the Three.js examples asset collection:

- `earth-day.jpg`: https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg
- `earth-night.png`: https://threejs.org/examples/textures/planets/earth_lights_2048.png

The maps are stored locally so visitors do not request assets from a third party.
The globe uses a software sphere projection with fixed lighting and a 180-second eastward revolution, capped at 20 frames per second and 900 pixels wide. It pauses when outside the viewport or the document is hidden, and stays still when reduced motion is requested. The original generated sunrise image remains as a fallback when the textures cannot load. The software renderer avoids a WebGL driver crash observed in the local preview. The final light treatment uses a subdued sun and a narrow gold atmospheric glow following the horizon, per the user's reference.
