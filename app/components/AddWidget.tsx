import { Person } from "models/person";
import { Sticker } from "models/sticker";
import { Form, useActionData, useLoaderData, useTransition } from "remix";

interface Props {
  year: number
  week: number
  handleClose: () => void
}

export default function AddWidget({ year, week, handleClose }: Props) {
  const { stickers, people } = useLoaderData<{ stickers: Sticker[], people: Person[] }>();
  const actionData = useActionData();
  const transition = useTransition();


  return (
    <>
      <div className="background" onClick={handleClose} />
      <Form method="post">
        <fieldset disabled={transition.state === "submitting"}>
          <div className="add-sticker-widget">
            {actionData?.error ? (
              <div className="error">{actionData?.error}</div>
            ) : null}

            <div className="add-sticker-widget__group">
              {people.map(p => (
                <div key={p.id} className="add-sticker-widget__option">
                  <input id={`people_${p.id}`} type="radio" name="people_id" value={p.id} required />
                  <label htmlFor={`people_${p.id}`}>{p.name}</label>
                </div>
              ))}
            </div>

            <div className="add-sticker-widget__group">
              {stickers.map(s => (
                <div key={s.id} className="add-sticker-widget__option">
                  <input id={`stickers_${s.id}`} type="radio" name="sticker_id" value={s.id} required />
                  <label htmlFor={`stickers_${s.id}`}>{s.name}</label>
                </div>
              ))}
            </div>

            <input type="hidden" name="year" value={year} />
            <input type="hidden" name="week" value={week} />

            <button type="submit">
            {transition.state === "submitting" ? "Adding..." : "Add"}
            </button>
          </div>
        </fieldset>
      </Form>
    </>
  )
}
