/**
 * A source, shown where it is cited. On wide screens it sits in the margin beside the line that
 * cites it (floated out of the reading column). On smaller screens the number is a button that
 * opens the source as a card at the bottom of the screen, using the browser's popover: tap
 * outside or press Esc to close. No JavaScript either way. Hovering the note or its number
 * highlights the other.
 */
export function Sidenote({
  n,
  id,
  children,
}: {
  n: string;
  id: string;
  children: React.ReactNode;
}) {
  const noteId = `note-${id}`;
  return (
    <span className="group/note">
      <sup className="font-sans text-[0.65em] font-semibold text-signal">
        <button
          type="button"
          popoverTarget={noteId}
          aria-label={`Source ${n}`}
          className="relative rounded-[2px] px-px leading-none after:absolute after:-inset-3 notes:hidden"
        >
          {n}
        </button>
        <span className="hidden rounded-[2px] px-px transition-colors duration-(--dur-hover) group-hover/note:bg-signal group-hover/note:text-paper notes:inline">
          {n}
        </span>
      </sup>
      <span
        id={noteId}
        popover="auto"
        role="note"
        className={
          // Small screens: a card fixed to the bottom of the screen while open.
          "fixed inset-x-4 top-auto bottom-4 mx-auto my-0 w-auto max-w-120 rounded-inline border-0 bg-paper p-5 pr-14 " +
          "font-sans text-small text-slate shadow-e3 backdrop:bg-ink/20 " +
          "transition-[opacity,translate,display,overlay] transition-discrete duration-(--dur-ui) ease-out starting:open:translate-y-2 starting:open:opacity-0 " +
          // Wide screens: always shown, in the margin to the right of the reading column.
          "notes:static notes:float-right notes:clear-right notes:mt-1.5 notes:-mr-[calc(var(--sidenote-width)+var(--sidenote-gap))] notes:mb-4 " +
          "notes:block notes:w-(--sidenote-width) notes:overflow-visible notes:rounded-none notes:bg-transparent notes:p-0 notes:shadow-none notes:transition-colors " +
          "notes:group-hover/note:text-ink"
        }
      >
        <span className="font-semibold text-ink tabular-nums">{n}</span> {children}
        <button
          type="button"
          popoverTarget={noteId}
          popoverTargetAction="hide"
          aria-label="Close"
          className="absolute top-2 right-2 inline-flex size-11 items-center justify-center rounded-control text-muted is-hover:text-ink notes:hidden"
        >
          <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 4l8 8M12 4l-8 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </span>
    </span>
  );
}
