import Image from "next/image";

// An image inside an essay, up to the wide figure width, with a caption underneath.
export function Figure({
  src,
  alt,
  width,
  height,
  caption,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}) {
  return (
    <figure className="essay-wide my-12">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-auto w-full rounded-card"
      />
      {caption && <figcaption className="mt-3 text-small text-muted">{caption}</figcaption>}
    </figure>
  );
}
