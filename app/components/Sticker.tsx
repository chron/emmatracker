import { Person } from "models/person";
import { Sticker } from "models/sticker";

interface Props {
  person: Person
  sticker: Sticker
}

// TODO: put this somewhere smart
declare module 'react' {
  interface CSSProperties {
      [key: `--${string}`]: string | number
  }
}

export default function Sticker({ person, sticker }: Props) {
  return (
    <div className="sticker" style={{'--sticker-color': person.color }}>
      <svg viewBox={sticker.svg_viewbox}>
        <path d={sticker.svg_path} />
      </svg>
    </div>
  )
}
