export type Project = {
  id: string;
  address: string;
  area: string;
  sf?: number;
  year?: number;
  scope: string;
  group: "manhattan" | "nassau" | "commercial";
  /** Number of photos in /public/projects/<id>/, 01.jpg through NN.jpg. 0 = no gallery. */
  photoCount: number;
};

export const projects: Project[] = [
  // Manhattan residences
  {
    id: "lincoln-square",
    address: "Lincoln Square",
    area: "Upper West Side",
    sf: 2000,
    scope:
      "Complete interior renovation of a condominium. Marble slab bathrooms, custom finishes, millwork and flooring, central air conditioning",
    group: "manhattan",
    photoCount: 10,
  },
  {
    id: "union-square-west",
    address: "Union Square West",
    area: "Flatiron",
    sf: 2800,
    scope:
      "Duplex condominium. Spa room with steam shower, home automation, interior finishes",
    group: "manhattan",
    photoCount: 9,
  },
  {
    id: "midtown",
    address: "Midtown",
    area: "Midtown",
    sf: 3000,
    scope:
      "Complete interior renovation of a penthouse, including structural work and exterior roof decks",
    group: "manhattan",
    photoCount: 19,
  },
  {
    id: "central-park-west",
    address: "Central Park West",
    area: "Upper West Side",
    sf: 4000,
    scope: "Custom specialty paint finishes and audio/visual systems",
    group: "manhattan",
    photoCount: 10,
  },
  {
    id: "central-park-west-68th",
    address: "Central Park West at 68th Street",
    area: "Upper West Side",
    sf: 1200,
    scope: "Interior renovation",
    group: "manhattan",
    photoCount: 6,
  },
  {
    id: "garment-district",
    address: "Garment District",
    area: "Garment District",
    sf: 2000,
    scope: "Complete interior renovation of a loft",
    group: "manhattan",
    photoCount: 6,
  },
  {
    id: "79th-street",
    address: "79th Street",
    area: "Upper West Side",
    sf: 2000,
    scope: "Interior finishes",
    group: "manhattan",
    photoCount: 4,
  },
  {
    id: "67th-street",
    address: "67th Street",
    area: "Upper West Side",
    sf: 1500,
    scope: "Two apartments combined into a single residence",
    group: "manhattan",
    photoCount: 8,
  },
  {
    id: "15-central-park-west",
    address: "15 Central Park West",
    area: "Upper West Side",
    year: 2008,
    scope: "Apartment renovation",
    group: "manhattan",
    photoCount: 0,
  },
  {
    id: "9th-street",
    address: "9th Street",
    area: "Manhattan",
    year: 2011,
    scope: "Penthouse renovation",
    group: "manhattan",
    photoCount: 0,
  },
  {
    id: "16th-street",
    address: "16th Street",
    area: "Manhattan",
    year: 2006,
    scope: "Penthouse renovation",
    group: "manhattan",
    photoCount: 0,
  },
  {
    id: "42nd-street",
    address: "42nd Street",
    area: "Manhattan",
    year: 2010,
    scope: "Apartment finishes",
    group: "manhattan",
    photoCount: 0,
  },
  {
    id: "99-jane-street",
    address: "99 Jane Street",
    area: "West Village",
    year: 2007,
    scope: "Hallway renovation",
    group: "manhattan",
    photoCount: 0,
  },

  // Nassau County residences
  {
    id: "great-neck-theater",
    address: "Great Neck",
    area: "Nassau County",
    year: 2012,
    scope: "Home theater",
    group: "nassau",
    photoCount: 0,
  },
  {
    id: "old-westbury",
    address: "Old Westbury",
    area: "Nassau County",
    year: 2011,
    scope: "Home theater",
    group: "nassau",
    photoCount: 0,
  },
  {
    id: "great-neck-apartment",
    address: "Great Neck",
    area: "Nassau County",
    year: 2006,
    scope: "Apartment renovation",
    group: "nassau",
    photoCount: 0,
  },

  // Commercial, showhouse and installation
  {
    id: "hamptons-designer-showhouse",
    address: "2010 Hamptons Designer Showhouse",
    area: "The Hamptons",
    scope: "",
    group: "commercial",
    photoCount: 6,
  },
  {
    id: "woods-witt-dealy",
    address: "Woods, Witt, Dealy & Sons, 40th Street",
    area: "Midtown",
    year: 2012,
    scope: "Office renovation",
    group: "commercial",
    photoCount: 0,
  },
  {
    id: "blow-dry-bar",
    address: "Blow, The New York Blow Dry Bar, 14th Street",
    area: "Union Square",
    year: 2011,
    scope: "",
    group: "commercial",
    photoCount: 0,
  },
  {
    id: "design-on-a-dime",
    address: "Design on a Dime, benefitting Housing Works",
    area: "Manhattan",
    year: 2011,
    scope: "With Bradley Stephens Design",
    group: "commercial",
    photoCount: 0,
  },
  {
    id: "cooper-hewitt",
    address: "Cooper Hewitt National Design Awards after-party set",
    area: "Manhattan",
    year: 2005,
    scope: "With Bradley Stephens Design",
    group: "commercial",
    photoCount: 0,
  },
];
