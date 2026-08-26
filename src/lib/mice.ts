import { photo } from "@/lib/images";

/**
 * MICE is the core of the business, so the homepage leads with it. Everything
 * here is picture-first by design: a destination carries a name, a country and
 * one line of capability — no prices anywhere, because pricing is quoted
 * against a brief.
 */

export type ConferenceDestination = {
  slug: string;
  city: string;
  country: string;
  /** One line. Resist making this a paragraph — the photograph does the work. */
  note: string;
  image: string;
  /**
   * Wide tiles carry the strongest photography. Keep exactly four of them: at
   * four columns, twelve tiles plus four double-width ones fill four rows with
   * no ragged tail. Row-spans were tried and always left a hole.
   */
  span?: "wide";
};

export const CONFERENCE_DESTINATIONS: ConferenceDestination[] = [
  {
    slug: "dubai",
    city: "Dubai",
    country: "United Arab Emirates",
    note: "Purpose-built convention halls with the hotel inventory next door.",
    image: photo("1512453979798-5ea266f8880c", 1600),
    span: "wide",
  },
  {
    slug: "singapore",
    city: "Singapore",
    country: "Singapore",
    note: "Asia's most reliable conference city — and the easiest visas.",
    image: photo("1508964942454-1a56651d54ac", 1200),
  },
  {
    slug: "london",
    city: "London",
    country: "United Kingdom",
    note: "Royal colleges and teaching hospitals for medical programmes.",
    image: photo("1533929736458-ca588d08c8be", 1200),
  },
  {
    slug: "bali",
    city: "Bali",
    country: "Indonesia",
    note: "Resort conferencing where the incentive is the venue.",
    image: photo("1537996194471-e657df975ab4", 1200),
    span: "wide",
  },
  {
    slug: "rome",
    city: "Rome",
    country: "Italy",
    note: "Congress centres inside a city delegates will extend their stay in.",
    image: photo("1552832230-c0197dd311b5", 1200),
  },
  {
    slug: "prague",
    city: "Prague",
    country: "Czechia",
    note: "European congress capacity at a fraction of the western cost.",
    image: photo("1519677100203-a0e668c92439", 1200),
  },
  {
    slug: "jaipur",
    city: "Jaipur",
    country: "India",
    note: "Palace venues that make a domestic offsite feel international.",
    image: photo("1477587458883-47145ed94245", 1200),
    span: "wide",
  },
  {
    slug: "kerala",
    city: "Kochi & Kumarakom",
    country: "India",
    note: "Backwater resorts built for residential seminars.",
    image: photo("1602216056096-3b40cc0c9944", 1200),
  },
  {
    slug: "muscat",
    city: "Muscat",
    country: "Oman",
    note: "Four hours from Mumbai, and quiet enough to actually work.",
    image: photo("1547471080-7cc2caa01a7e", 1200),
  },
  {
    slug: "maldives",
    city: "Maldives",
    country: "Maldives",
    note: "Whole-island buyouts for board retreats and top-performer trips.",
    image: photo("1507525428034-b723cf961d3e", 1200),
    span: "wide",
  },
  {
    slug: "new-york",
    city: "New York",
    country: "United States",
    note: "Trade shows, investor days and the exhibition floor that matters.",
    image: photo("1449824913935-59a10b8d2000", 1200),
  },
  {
    slug: "san-francisco",
    city: "San Francisco",
    country: "United States",
    note: "Technology and life-sciences conventions, with the campus visits.",
    image: photo("1506146332389-18140dc7b2fb", 1200),
  },
];

export type ClientType = {
  slug: string;
  label: string;
  note: string;
  image: string;
};

/** Who actually books us. Corporates and hospitals lead, in that order. */
export const CLIENT_TYPES: ClientType[] = [
  {
    slug: "corporates",
    label: "Corporates",
    note: "Annual conventions, sales conferences, dealer meets, board offsites and reward travel.",
    image: photo("1531973576160-7125cd663d86", 1200),
  },
  {
    slug: "hospitals",
    label: "Hospitals & healthcare",
    note: "CMEs, symposia, surgical workshops and faculty travel — handled with the compliance the sector requires.",
    image: photo("1519494026892-80bbd2d6fd0d", 1200),
  },
  {
    slug: "associations",
    label: "Associations & societies",
    note: "Annual congresses with delegate registration, abstracts, and an exhibition floor to fill.",
    image: photo("1498243691581-b145c3f54a5a", 1200),
  },
  {
    slug: "institutions",
    label: "Institutions & academia",
    note: "Convocations, research summits and international faculty movement.",
    image: photo("1562774053-701939374585", 1200),
  },
];

export type EventFormat = {
  slug: string;
  label: string;
  note: string;
  image: string;
};

export const EVENT_FORMATS: EventFormat[] = [
  {
    slug: "conferences",
    label: "Conferences & conventions",
    note: "Plenary, breakouts, exhibition floor, delegate desk.",
    image: photo("1540575467063-178a50c2df87", 900),
  },
  {
    slug: "seminars",
    label: "Seminars & CMEs",
    note: "Accredited medical education, faculty logistics, compliance records.",
    image: photo("1524178232363-1fb2b075b655", 900),
  },
  {
    slug: "incentives",
    label: "Incentive travel",
    note: "Programmes people compete to be sent on.",
    image: photo("1596436889106-be35e843f974", 900),
  },
  {
    slug: "exhibitions",
    label: "Exhibitions & trade shows",
    note: "Stand build, shipping, staffing and buyer meetings.",
    image: photo("1540317580384-e5d43616b9aa", 900),
  },
  {
    slug: "launches",
    label: "Product launches",
    note: "Stage, film, rehearsal and a run-of-show that holds.",
    image: photo("1531058020387-3be344556be6", 900),
  },
  {
    slug: "offsites",
    label: "Meetings & offsites",
    note: "Residential sessions where the setting does some of the work.",
    image: photo("1517840901100-8179e982acb7", 900),
  },
];
