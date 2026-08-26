export type CurrencyCode = "INR" | "USD";

export type RegionId =
  | "himalaya"
  | "indian-ocean"
  | "southeast-asia"
  | "arabia"
  | "east-africa"
  | "mediterranean"
  | "south-america";

export type TripTypeId =
  | "honeymoon"
  | "family"
  | "adventure"
  | "corporate"
  | "wellness"
  | "culture";

export type Region = { id: RegionId; label: string; blurb: string };
export type TripType = { id: TripTypeId; label: string; blurb: string };

export type ItineraryDay = {
  day: number;
  title: string;
  place: string;
  description: string;
  stay: string;
  meals: ("Breakfast" | "Lunch" | "Dinner")[];
  /** Optional signature moment surfaced as a gold callout in the timeline. */
  highlight?: string;
};

export type RoutePoint = {
  name: string;
  /** Normalised 0–100 coordinates inside the package's own map frame. */
  x: number;
  y: number;
  nights: number;
  arriveDay: number;
};

export type RoomType = {
  id: string;
  name: string;
  description: string;
  /** Multiplier applied to the per-adult land cost. */
  multiplier: number;
  maxAdults: number;
};

export type AddOn = {
  id: string;
  name: string;
  description: string;
  /** Price in INR. */
  price: number;
  unit: "per-traveller" | "per-booking";
  recommended?: boolean;
};

export type Package = {
  slug: string;
  name: string;
  tagline: string;
  destination: string;
  country: string;
  region: RegionId;
  tripTypes: TripTypeId[];
  nights: number;
  /** Per-adult land cost in INR, before season, room, group and tax logic. */
  baseAdultINR: number;
  /** Flights, visas etc. — a per-traveller fixed component that never discounts. */
  fixedPerTravellerINR: number;
  rating: number;
  reviewCount: number;
  hero: string;
  gallery: { src: string; caption: string }[];
  summary: string;
  editorsNote: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  route: RoutePoint[];
  rooms: RoomType[];
  addOns: AddOn[];
  /** Twelve multipliers, Jan→Dec, applied to the land cost. Peak season costs more. */
  seasonality: number[];
  groupSizeMax: number;
  physicality: "Gentle" | "Moderate" | "Active";
};

export type Review = {
  id: string;
  author: string;
  initials: string;
  packageSlug: string;
  region: RegionId;
  tripType: TripTypeId;
  rating: number;
  travelledOn: string;
  title: string;
  body: string;
  photos: string[];
};
