import { Reveal } from "@/components/Reveal";

// Engraved line work for the Intaglio prototype: certificate borders, corner rosettes and section
// rules. Borders are generated from each project's key, so no two certificates look alike.

/** A small, stable number in [0, 1) from a string. */
function seed(text: string) {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return (h >>> 0) / 4294967296;
}

/** One tile of interlaced waves, `period` long and 16 high. */
function waveTile(period: number, lines: number, bend: number) {
  return Array.from({ length: lines }, (_, j) => {
    const phase = (j / lines) * Math.PI;
    let d = "";
    for (let i = 0; i <= 40; i++) {
      const t = (i / 40) * Math.PI * 2;
      const y = 8 + 4.6 * Math.sin(t + phase) + 1.6 * bend * Math.sin(2 * t - phase);
      d += `${i ? "L" : "M"}${((i / 40) * period).toFixed(2)},${y.toFixed(2)}`;
    }
    return d;
  });
}

/** A small guilloché rosette, defined once per page and reused at every certificate corner. */
export function EngravingDefs() {
  const loops = Array.from({ length: 5 }, (_, j) => {
    const phase = (j / 5) * ((Math.PI * 2) / 6);
    let d = "";
    for (let i = 0; i <= 72; i++) {
      const t = (i / 72) * Math.PI * 2;
      const r = 9 + 4.5 * Math.sin(6 * t + phase);
      d += `${i ? "L" : "M"}${(16 + r * Math.cos(t)).toFixed(2)},${(16 + r * Math.sin(t)).toFixed(2)}`;
    }
    return d + "Z";
  });
  return (
    <svg aria-hidden width={0} height={0} className="absolute">
      <symbol id="corner-rosette" viewBox="0 0 32 32">
        <circle
          cx={16}
          cy={16}
          r={15}
          fill="var(--paper)"
          stroke="currentColor"
          strokeWidth={0.6}
        />
        {loops.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth={0.5} />
        ))}
        <circle cx={16} cy={16} r={2} fill="currentColor" />
      </symbol>
    </svg>
  );
}

/**
 * The engraved border of a certificate: a fine outer rule, a band of waves on each side, a rosette
 * at each corner and a fine inner rule. Sits inside a `relative` box.
 */
export function CertificateBorder({ seedKey }: { seedKey: string }) {
  const id = `wave-${seedKey}`;
  const period = 18 + Math.round(seed(seedKey) * 14);
  const tile = waveTile(period, 3 + Math.round(seed(`${seedKey}l`) * 2), seed(`${seedKey}b`));
  const pattern = (suffix: string, transform?: string) => (
    <pattern
      id={`${id}-${suffix}`}
      width={period}
      height={16}
      patternUnits="userSpaceOnUse"
      patternTransform={transform}
    >
      {tile.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth={0.55} />
      ))}
    </pattern>
  );
  const band = "pointer-events-none absolute";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute inset-1 border border-current" />
      <svg className={`${band} top-3 left-8 h-4 w-[calc(100%-4rem)]`}>
        <defs>{pattern("h")}</defs>
        <rect width="100%" height="100%" fill={`url(#${id}-h)`} />
      </svg>
      <svg className={`${band} bottom-3 left-8 h-4 w-[calc(100%-4rem)]`}>
        <rect width="100%" height="100%" fill={`url(#${id}-h)`} />
      </svg>
      <svg className={`${band} top-8 left-3 h-[calc(100%-4rem)] w-4`}>
        <defs>{pattern("v", "translate(16 0) rotate(90)")}</defs>
        <rect width="100%" height="100%" fill={`url(#${id}-v)`} />
      </svg>
      <svg className={`${band} top-8 right-3 h-[calc(100%-4rem)] w-4`}>
        <rect width="100%" height="100%" fill={`url(#${id}-v)`} />
      </svg>
      {["top-1 left-1", "top-1 right-1", "bottom-1 left-1", "bottom-1 right-1"].map((at) => (
        <svg key={at} className={`${band} ${at} size-10`}>
          <use href="#corner-rosette" />
        </svg>
      ))}
      <div className="absolute inset-[2.25rem] border border-current opacity-60" />
    </div>
  );
}

/** A section break: a band of interlaced waves, engraved across the page as you reach it. */
export function EngravedRule({ className }: { className?: string }) {
  const tile = waveTile(28, 4, 0);
  return (
    <Reveal className={className}>
      <svg aria-hidden className="engrave-in block h-4 w-full text-(--engrave)">
        <defs>
          <pattern id="engraved-rule" width={28} height={16} patternUnits="userSpaceOnUse">
            {tile.map((d, i) => (
              <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth={0.6} />
            ))}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#engraved-rule)" />
      </svg>
    </Reveal>
  );
}
