/**
 * Paints the Trading day prototype for an hour of the London day (0 to 24, fractional): sky, ground
 * and ink blend between night, pre-open, market hours and the close, and the sun or moon moves
 * across the sky. Self-contained, because it is also inlined as a script that runs before the
 * first paint, so the page never flashes the wrong time of day.
 */
export function paintTradingDay(hourOverride?: number) {
  const root = document.querySelector<HTMLElement>(".proposal-trading-day");
  if (!root) return;

  let hour = hourOverride;
  if (hour === undefined) {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h23",
    }).formatToParts(new Date());
    const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
    hour = get("hour") + get("minute") / 60;
  }

  // [skyTop, skyBottom, ground, ink, muted, sun]
  const night = ["#0a1222", "#18233d", "#0d1320", "#e6ebf2", "#9aa5b8", "#d9e2f0"];
  const preOpen = ["#c4d2e6", "#eef1f5", "#eef1f5", "#1f2a3a", "#5d6878", "#f6e7c4"];
  const open = ["#bcd5f5", "#ffffff", "#ffffff", "#0f1e36", "#5a6577", "#ffd98a"];
  const close = ["#e7c3a0", "#f3ede6", "#f3ede6", "#38302c", "#77695f", "#f2a65e"];
  const sunset = ["#cf8a6a", "#f2cfa6", "#f3ede6", "#38302c", "#77695f", "#ee8a4c"];
  const dusk = ["#22304f", "#a8747a", "#121929", "#e9ecf2", "#a3acbd", "#f0b089"];
  const stops: Array<[number, string[]]> = [
    [0, night],
    [5.5, night],
    [7, preOpen],
    [8, open],
    [16.5, open],
    [17.5, close],
    [18.75, sunset],
    [19.75, dusk],
    [21, night],
    [24, night],
  ];
  let i = 0;
  while (i < stops.length - 2 && hour > stops[i + 1][0]) i++;
  const [h0, a] = stops[i];
  const [h1, b] = stops[i + 1];
  const t = h1 === h0 ? 0 : Math.min(1, Math.max(0, (hour - h0) / (h1 - h0)));
  const rgb = (hex: string) => [1, 3, 5].map((k) => parseInt(hex.slice(k, k + 2), 16));
  // The sky blends slowly. When the page itself turns between light and dark, the ground and
  // text switch at the midpoint instead (with a CSS transition), so they are never a muddy grey
  // and the text never loses contrast.
  const dark = (palette: string[]) => rgb(palette[2]).reduce((x, y) => x + y) < 384;
  const flips = dark(a) !== dark(b);
  const fast = flips ? (t < 0.5 ? 0 : 1) : t;
  const mix = (x: string, y: string, amount: number) => {
    const [p, q] = [rgb(x), rgb(y)];
    return p.map((v, k) => Math.round(v + (q[k] - v) * amount));
  };
  const names = ["--sky-top", "--sky-bottom", "--ground", "--ink", "--muted", "--sun"];
  names.forEach((name, k) =>
    root.style.setProperty(name, `rgb(${mix(a[k], b[k], k >= 2 && k <= 4 ? fast : t).join(" ")})`),
  );
  const ink = mix(a[3], b[3], fast).join(" ");
  root.style.setProperty("--slate", `rgb(${ink} / 0.8)`);
  root.style.setProperty("--rule", `rgb(${ink} / 0.14)`);
  root.style.setProperty("--line-strong", `rgb(${ink} / 0.3)`);

  // The sun rises at 6:00 and sets at 20:00 on this stylised day; the moon has the rest.
  const day = (hour - 6) / 14;
  const isDay = day >= 0 && day <= 1;
  const arc = isDay ? day : ((hour + 24 - 20) % 24) / 10;
  // Its path keeps to the right half of the sky, clear of the headline.
  root.style.setProperty("--sun-x", `${56 + Math.min(1, arc) * 36}%`);
  root.style.setProperty("--sun-y", `${76 - Math.sin(Math.min(1, arc) * Math.PI) * 38}%`);
  root.style.setProperty("--sun-size", isDay ? "5.5rem" : "2.75rem");
  root.dataset.dark = String(dark(fast > 0.5 ? b : a));
}
