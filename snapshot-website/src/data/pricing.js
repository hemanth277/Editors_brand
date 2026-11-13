// ============================================================
// CENTRALIZED PRICING CONFIGURATION
// Edit prices, package names, and features here ONLY
// ============================================================

export const packages = [
  {
    id: 1,
    code: "PACKAGE 01",
    name: "Half Day Plan",
    price: 4999,
    duration: "Up to 4 Hours",
    badge: null,
    features: [
      "Up to 4 hours of coverage",
      "One professional Reel Maker",
      "Vertical video shooting",
      "Edited highlight reels",
      "Digital delivery",
    ],
  },
  {
    id: 2,
    code: "PACKAGE 02",
    name: "Full Day Plan",
    price: 8999,
    duration: "Up to 8 Hours",
    badge: "Most Popular",
    features: [
      "Up to 8 hours of coverage",
      "Professional event coverage",
      "Multiple edited reels",
      "Candid moments",
      "Digital delivery",
    ],
  },
  {
    id: 3,
    code: "PACKAGE 03",
    name: "Premium Plan",
    price: 14999,
    duration: "Full Day",
    badge: "Best Value",
    features: [
      "Full-day event coverage",
      "Premium creative coverage",
      "Multiple highlight reels",
      "Priority editing",
      "Customized deliverables",
    ],
  },
];

export const addOns = [
  { id: 1, name: "Additional Coverage", price: 1250, unit: "per hour" },
  { id: 2, name: "Extra Edited Reel", price: 750, unit: "per reel" },
  { id: 3, name: "Express Delivery", price: null, unit: "custom pricing" },
];
