/**
 * Sample catalogue for SPORTZONE. Frontend-only demo data: prices in Indian
 * rupees, ratings marked as sample data, all editable in one place.
 */
import type { Faq, Kit, Product, Review, Sport } from "./types.ts";

export const SPORTS: Sport[] = [
  { id: "cricket", name: "Cricket", mark: "CR", blurb: "Bats, kits, gloves", gradient: "from-orange-500 to-red-600" },
  { id: "football", name: "Football", mark: "FB", blurb: "Boots, balls, jerseys", gradient: "from-emerald-500 to-teal-700" },
  { id: "basketball", name: "Basketball", mark: "BB", blurb: "Balls, shoes, hoops", gradient: "from-amber-500 to-orange-700" },
  { id: "badminton", name: "Badminton", mark: "BM", blurb: "Rackets, shuttles, kits", gradient: "from-sky-500 to-blue-700" },
  { id: "tennis", name: "Tennis", mark: "TN", blurb: "Rackets, balls, bags", gradient: "from-lime-500 to-green-700" },
  { id: "volleyball", name: "Volleyball", mark: "VB", blurb: "Balls, nets, knee pads", gradient: "from-violet-500 to-purple-700" },
  { id: "table-tennis", name: "Table Tennis", mark: "TT", blurb: "Bats, balls, tables", gradient: "from-rose-500 to-red-700" },
  { id: "gym", name: "Gym & Fitness", mark: "GY", blurb: "Dumbbells, bands, gear", gradient: "from-zinc-600 to-zinc-900" },
  { id: "running", name: "Running & Athletics", mark: "RA", blurb: "Shoes, bottles, watches", gradient: "from-cyan-500 to-sky-700" },
  { id: "swimming", name: "Swimming", mark: "SW", blurb: "Goggles, caps, kits", gradient: "from-blue-500 to-indigo-700" },
  { id: "boxing", name: "Boxing & Martial Arts", mark: "BX", blurb: "Gloves, pads, bags", gradient: "from-red-500 to-rose-800" },
  { id: "hockey", name: "Hockey", mark: "HK", blurb: "Sticks, balls, guards", gradient: "from-fuchsia-500 to-pink-700" },
];

export const PRODUCTS: Product[] = [
  // Cricket
  { id: "p-cricket-bat-1", name: "Willow Pro Cricket Bat", brand: "SG", category: "cricket", price: 8499, originalPrice: 11999, rating: 4.6, reviews: 214, sizes: ["SH", "LH"], bestSeller: true },
  { id: "p-cricket-ball-1", name: "Match Leather Ball (Pack of 3)", brand: "SG", category: "cricket", price: 1799, originalPrice: 2299, rating: 4.4, reviews: 96 },
  { id: "p-cricket-gloves-1", name: "Club Batting Gloves", brand: "SS", category: "cricket", price: 1299, rating: 4.2, reviews: 61, colors: ["White", "Navy"] },
  { id: "p-cricket-pads-1", name: "Test Series Batting Pads", brand: "SG", category: "cricket", price: 3299, originalPrice: 3999, rating: 4.5, reviews: 88, sizes: ["Youth", "Men"] },
  { id: "p-cricket-kit-1", name: "Academy Cricket Kit Bag", brand: "SPORTZONE", category: "cricket", price: 5999, originalPrice: 7499, rating: 4.3, reviews: 34 },
  // Football
  { id: "p-football-1", name: "Strike Match Football", brand: "Adidas", category: "football", price: 1499, originalPrice: 1999, rating: 4.5, reviews: 173, sizes: ["5", "4"] },
  { id: "p-football-boots-1", name: "Predator Edge Boots", brand: "Adidas", category: "football", price: 12499, originalPrice: 15999, rating: 4.7, reviews: 121, sizes: ["UK 7", "UK 8", "UK 9", "UK 10"], colors: ["Black/Orange", "White/Blue"], bestSeller: true },
  { id: "p-football-jersey-1", name: "Home Fan Jersey 24/25", brand: "Nike", category: "football", price: 3499, rating: 4.4, reviews: 210, sizes: ["S", "M", "L", "XL"] },
  { id: "p-football-shinguards-1", name: "Pro Lite Shin Guards", brand: "Puma", category: "football", price: 1199, originalPrice: 1599, rating: 4.1, reviews: 47, sizes: ["S", "M", "L"] },
  { id: "p-football-gk-gloves-1", name: "Grip Goalkeeper Gloves", brand: "SPORTZONE", category: "football", price: 2299, rating: 4.2, reviews: 38, sizes: ["8", "9", "10"] },
  // Basketball
  { id: "p-basketball-1", name: "Elite Grip Basketball (Size 7)", brand: "Nike", category: "basketball", price: 2499, originalPrice: 2999, rating: 4.6, reviews: 156, bestSeller: true },
  { id: "p-basketball-shoes-1", name: "Court Vision Basketball Shoes", brand: "Nike", category: "basketball", price: 7995, originalPrice: 9995, rating: 4.5, reviews: 98, sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"] },
  { id: "p-basketball-jersey-1", name: "Mesh Reversible Jersey", brand: "SPORTZONE", category: "basketball", price: 1499, rating: 4.2, reviews: 55, sizes: ["S", "M", "L", "XL"], colors: ["Red", "Blue"] },
  // Badminton
  { id: "p-badminton-racket-1", name: "Astrox 88 S Pro Racket", brand: "Yonex", category: "badminton", price: 15900, originalPrice: 18900, rating: 4.8, reviews: 264, isNew: true },
  { id: "p-badminton-shuttle-1", name: "Aerosensa Feather Shuttles (Tube of 6)", brand: "Yonex", category: "badminton", price: 1350, originalPrice: 1590, rating: 4.6, reviews: 187 },
  { id: "p-badminton-grip-1", name: "Tacky Comfort Grip (3-Pack)", brand: "Yonex", category: "badminton", price: 299, rating: 4.3, reviews: 240 },
  { id: "p-badminton-kit-1", name: "Sundrop Badminton Kit Bag", brand: "SPORTZONE", category: "badminton", price: 2899, originalPrice: 3499, rating: 4.4, reviews: 26 },
  // Tennis
  { id: "p-tennis-racket-1", name: "Blade 98 V8 Racket", brand: "Wilson", category: "tennis", price: 17900, originalPrice: 19900, rating: 4.7, reviews: 143, isNew: true },
  { id: "p-tennis-balls-1", name: "Championship Tennis Balls (Tube of 3)", brand: "Wilson", category: "tennis", price: 899, rating: 4.5, reviews: 176 },
  { id: "p-tennis-bag-1", name: "Tour 9-Racquet Thermal Bag", brand: "Wilson", category: "tennis", price: 9499, originalPrice: 11999, rating: 4.6, reviews: 64 },
  // Gym
  { id: "p-gym-dumbbells-1", name: "Rubber Hex Dumbbell Pair (10kg)", brand: "SPORTZONE", category: "gym", price: 4499, originalPrice: 5999, rating: 4.5, reviews: 189, bestSeller: true },
  { id: "p-gym-bands-1", name: "Resistance Bands Set (5 Levels)", brand: "SPORTZONE", category: "gym", price: 999, originalPrice: 1499, rating: 4.4, reviews: 302 },
  { id: "p-gym-rope-1", name: "Speed Jump Rope (Bearing)", brand: "SPORTZONE", category: "gym", price: 649, rating: 4.2, reviews: 128 },
  { id: "p-gym-bottle-1", name: "Grip Sipper Bottle 1L", brand: "Puma", category: "gym", price: 799, rating: 4.0, reviews: 84 },
  // Running
  { id: "p-running-shoes-1", name: "Pegasus Trail Shoes", brand: "Nike", category: "running", price: 8995, originalPrice: 10995, rating: 4.6, reviews: 231, sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"], colors: ["Black/Volt", "Blue/White"], isNew: true },
  { id: "p-running-bottle-1", name: "Handheld Runner Bottle 500ml", brand: "Nike", category: "running", price: 1199, rating: 4.3, reviews: 66 },
  // Swimming
  { id: "p-swim-goggles-1", name: "Vanquisher Goggles", brand: "Speedo", category: "swimming", price: 1899, originalPrice: 2399, rating: 4.5, reviews: 142, colors: ["Smoke", "Clear"] },
  { id: "p-swim-cap-1", name: "Silicone Swim Cap", brand: "Speedo", category: "swimming", price: 499, rating: 4.4, reviews: 97, colors: ["Blue", "Pink"] },
  // Volleyball
  { id: "p-volleyball-1", name: "Beach Classic Volleyball", brand: "Mikasa", category: "volleyball", price: 2199, rating: 4.4, reviews: 58 },
  { id: "p-volleyball-kneepads-1", name: "Flex Knee Pads", brand: "Mikasa", category: "volleyball", price: 1499, rating: 4.2, reviews: 41, sizes: ["S", "M", "L"] },
  // Table tennis
  { id: "p-tt-bat-1", name: "Sweeper Pro Table Tennis Bat", brand: "Stag", category: "table-tennis", price: 1699, originalPrice: 2199, rating: 4.3, reviews: 73 },
  { id: "p-tt-balls-1", "name": "3-Star Plastic Balls (Pack of 6)", brand: "Stag", category: "table-tennis", price: 599, rating: 4.1, reviews: 112 },
  // Boxing
  { id: "p-boxing-gloves-1", name: "Sparring Gloves 12oz", brand: "Everlast", category: "boxing", price: 3499, originalPrice: 4299, rating: 4.5, reviews: 89, colors: ["Black", "Red"] },
  { id: "p-boxing-handwraps-1", name: "Cotton Hand Wraps (Pair)", brand: "Everlast", category: "boxing", price: 449, rating: 4.2, reviews: 133 },
  // Hockey
  { id: "p-hockey-stick-1", name: "Composite Hockey Stick 36.5", brand: "Grays", category: "hockey", price: 6499, originalPrice: 7999, rating: 4.4, reviews: 52, sizes: ["36.5L", "36.5M", "37.5M"] },
  { id: "p-hockey-ball-1", name: "Match Hockey Ball", brand: "Grays", category: "hockey", price: 549, rating: 4.3, reviews: 44 },
];

export const KITS: Kit[] = [
  {
    id: "k-cricket",
    name: "Complete Cricket Kit",
    tagline: "Bat, pads, gloves and bag for match day",
    category: "cricket",
    price: 15999,
    originalPrice: 22096,
    items: ["p-cricket-bat-1", "p-cricket-pads-1", "p-cricket-gloves-1", "p-cricket-kit-1", "p-cricket-ball-1"],
    rating: 4.6,
    reviews: 47,
  },
  {
    id: "k-football",
    name: "Football Starter Kit",
    tagline: "Ball, boots, guards and jersey",
    category: "football",
    price: 17499,
    originalPrice: 21095,
    items: ["p-football-1", "p-football-boots-1", "p-football-shinguards-1", "p-football-jersey-1"],
    rating: 4.5,
    reviews: 29,
  },
  {
    id: "k-badminton",
    name: "Badminton Combo Kit",
    tagline: "Racket, shuttles, grip and bag",
    category: "badminton",
    price: 17999,
    originalPrice: 20439,
    items: ["p-badminton-racket-1", "p-badminton-shuttle-1", "p-badminton-grip-1", "p-badminton-kit-1"],
    rating: 4.7,
    reviews: 33,
  },
  {
    id: "k-tennis",
    name: "Tennis Essentials Kit",
    tagline: "Racket, balls and thermal bag",
    category: "tennis",
    price: 25999,
    originalPrice: 29798,
    items: ["p-tennis-racket-1", "p-tennis-balls-1", "p-tennis-bag-1"],
    rating: 4.6,
    reviews: 21,
  },
  {
    id: "k-gym",
    name: "Gym Training Kit",
    tagline: "Dumbbells, bands, rope and bottle",
    category: "gym",
    price: 6499,
    originalPrice: 8296,
    items: ["p-gym-dumbbells-1", "p-gym-bands-1", "p-gym-rope-1", "p-gym-bottle-1"],
    rating: 4.4,
    reviews: 58,
  },
  {
    id: "k-school",
    name: "School Sports Kit",
    tagline: "Football, volleyball, TT bats and more for PT period",
    category: "football",
    price: 5999,
    originalPrice: 7494,
    items: ["p-football-1", "p-volleyball-1", "p-tt-bat-1", "p-tt-balls-1"],
    rating: 4.3,
    reviews: 19,
  },
];

export const REVIEWS: Review[] = [
  { name: "Aarav Mehta", location: "Mumbai", rating: 5, initials: "AM", text: "Ordered the complete cricket kit for my son. The bat's pickup is superb and everything arrived in two days. Genuine SG gear at a fair price." },
  { name: "Priya Nair", location: "Bengaluru", rating: 5, initials: "PN", text: "The Yonex racket I wanted was in stock and cheaper than my local shop. The coach at my academy approved the string tension too." },
  { name: "Rohan Gupta", location: "Delhi", rating: 4, initials: "RG", text: "Bought gym bands and dumbbells. Good quality for the price. One band clip was stiff at first but support sorted it quickly." },
  { name: "Sneha Kulkarni", location: "Pune", rating: 5, initials: "SK", text: "Football boots fit exactly as the size guide said. Speedy delivery before my tournament — that's why I keep coming back." },
  { name: "Vikram Singh", location: "Chandigarh", rating: 4, initials: "VS", text: "Solid range of hockey sticks with proper gram weights listed. The composite 36.5 is balanced and light in the hands." },
  { name: "Ananya Rao", location: "Hyderabad", rating: 5, initials: "AR", text: "Swimming goggles didn't fog even after long sessions. Website made choosing the right size simple with clear guides." },
];

export const FAQS: Faq[] = [
  { q: "How do I choose the right sports kit?", a: "Start with the level you play at and pick a kit one tier above your current one so gear lasts longer. Our kit pages list every included item with its own product page, and each sport section notes what beginners should prioritise. If you're between sizes, write to us and we'll help you choose." },
  { q: "What sizes are available and how do I pick one?", a: "Apparel runs S to XXL and footwear uses UK sizing, listed on every product card. Cricket bats are offered in short handle (SH) and long handle (LH); rackets list grip sizes. Each product page has a size guide, and you can swap an unused item if the fit isn't right." },
  { q: "How long do shipping and delivery take?", a: "Metro cities usually receive orders in 2 to 4 days, other pincodes in 4 to 7. Kits and heavier gear like dumbbells may take a day longer. You'll get a tracking link by email and SMS as soon as the order ships." },
  { q: "Can I return or exchange a product?", a: "Yes — unused items in original packaging can be returned within 7 days of delivery, and exchanged for a different size within 15. Kits count as one item, so return the whole kit together. Refunds reach the original payment method within 5 to 7 working days after quality check." },
  { q: "Which payment methods can I use?", a: "We accept UPI, credit and debit cards, net banking and cash on delivery up to ₹5,000. This demo store doesn't process real payments yet, so checkout stops before payment — the catalogue, cart and wishlist are fully working." },
  { q: "Do products come with a warranty?", a: "Bats, rackets and footwear carry brand warranties of 3 to 12 months depending on the maker; accessories and apparel are covered against manufacturing defects for 30 days. Warranty is provided by the brand, not SPORTZONE, and claims go through the brand's service centres." },
];

export const BRANDS: string[] = ["Nike", "Adidas", "Puma", "Yonex", "SG", "SS", "Wilson", "Speedo", "Mikasa", "Grays", "Stag", "Everlast"];
