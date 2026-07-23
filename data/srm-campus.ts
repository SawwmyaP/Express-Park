export const srmCampusGeoJSON: any = {
  type: "FeatureCollection",
  features: [
    // --- PARKING ZONES (Polygons) ---
    {
      type: "Feature",
      properties: {
        id: "zone-tech-park",
        name: "Tech Park Parking",
        type: "parking",
        capacity: 150
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [80.0435, 12.8236],
            [80.0440, 12.8236],
            [80.0440, 12.8240],
            [80.0435, 12.8240],
            [80.0435, 12.8236]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "zone-ub",
        name: "University Building Parking",
        type: "parking",
        capacity: 200
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [80.0420, 12.8225],
            [80.0425, 12.8225],
            [80.0425, 12.8229],
            [80.0420, 12.8229],
            [80.0420, 12.8225]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "zone-arch",
        name: "Architecture Block Parking",
        type: "parking",
        capacity: 80
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [80.0445, 12.8220],
            [80.0450, 12.8220],
            [80.0450, 12.8224],
            [80.0445, 12.8224],
            [80.0445, 12.8220]
          ]
        ]
      }
    },
    // --- GATES (Points) ---
    {
      type: "Feature",
      properties: {
        id: "gate-main",
        name: "Main Gate",
        type: "gate"
      },
      geometry: {
        type: "Point",
        coordinates: [80.0410, 12.8230]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "gate-potheri",
        name: "Potheri Gate",
        type: "gate"
      },
      geometry: {
        type: "Point",
        coordinates: [80.0455, 12.8245]
      }
    }
  ]
};

// Helper dictionary for routing coordinates (Lat, Lng)
export const locations: Record<string, [number, number]> = {
  "Main Gate": [12.8230, 80.0410],
  "Potheri Gate": [12.8245, 80.0455],
  "Tech Park": [12.8238, 80.04375], // Center of Tech Park Polygon
  "University Building": [12.8227, 80.04225],
  "Architecture Block": [12.8222, 80.04475]
};
