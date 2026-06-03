// Minimal classnames joiner (no extra dependency).
export function cn(...inputs: (string | false | null | undefined)[]) {
  return inputs.filter(Boolean).join(" ");
}

export function timeAgo(date: Date | string) {
  const d = (Date.now() - new Date(date).getTime()) / 1000;
  if (d < 60) return "just now";
  if (d < 3600) return Math.floor(d / 60) + "m ago";
  if (d < 86400) return Math.floor(d / 3600) + "h ago";
  return Math.floor(d / 86400) + "d ago";
}

const PX = "https://images.pexels.com/photos";

// Curated Pexels imagery — reliably hotlink-friendly (swap for your own photos anytime).
export const IMAGES = {
  hero:      `${PX}/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1000&h=700&dpr=1`,
  team:      `${PX}/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1000&h=700&dpr=1`,
  salon:     `${PX}/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&dpr=1`,
  store:     `${PX}/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&dpr=1`,
  dental:    `${PX}/305565/pexels-photo-305565.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&dpr=1`,
  interior:  `${PX}/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&dpr=1`,
  logistics: `${PX}/1427107/pexels-photo-1427107.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&dpr=1`,
  bakery:    `${PX}/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&dpr=1`,
};
