export const POI_CATEGORIES = {
    LIBRARY: "Library",
    STUDY: "Study Zone",
    AFFILIATE: "Affiliate College",
    CAMPUS: "Campus Building",
};

export const WESTERN_POIS = [
  // Affiliates / schools
    { id: "ivey", name: "Ivey Business School", lat: 43.0076, lng: -81.2728, category: POI_CATEGORIES.CAMPUS, tags: ["ivey", "study", "staff"] },
    { id: "huron", name: "Huron University College", lat: 43.0060, lng: -81.2748, category: POI_CATEGORIES.AFFILIATE, tags: ["huron", "quiet", "community"] },
    { id: "kings", name: "King’s University College", lat: 43.0071, lng: -81.2546, category: POI_CATEGORIES.AFFILIATE, tags: ["kings", "quiet", "community"] },

  // Libraries
    { id: "taylor", name: "Taylor Library", lat: 43.0089, lng: -81.2732, category: POI_CATEGORIES.LIBRARY, tags: ["library", "quiet", "outlets"] },
    { id: "weldon", name: "Weldon Library", lat: 43.0097, lng: -81.2721, category: POI_CATEGORIES.LIBRARY, tags: ["library", "research", "study"] },

  // Study zones
    { id: "ucc", name: "UCC (University Community Centre)", lat: 43.0096, lng: -81.2749, category: POI_CATEGORIES.STUDY, tags: ["busy", "staff", "social"] },
    { id: "nsc", name: "Natural Sciences Centre Atrium", lat: 43.0105, lng: -81.2762, category: POI_CATEGORIES.STUDY, tags: ["bright", "busy"] },
];
