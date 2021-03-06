import { LoaderFunction, useLoaderData, LinksFunction, ActionFunction, Link } from "remix";
import { supabase } from "../../lib/supabaseClient";
import { PersonSticker } from "../../models/PersonSticker";
import { DateTime } from "luxon";
import Sticker from "~/components/Sticker";
import stylesUrl from "~/styles/index.css";
import React from "react";
import AddWidget from "~/components/AddWidget";
import { Person } from "models/person";
import { Sticker as StickerModel } from "models/sticker";
import { getSession } from "~/sessions";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(
    request.headers.get("Cookie")
  );
  const isLoggedIn = session.has('userId');

  const { data: records, error: recordError } = await supabase
    .from<PersonSticker>("people_stickers")
    .select("id, year, week, people (id, name, color), stickers (id, name, svg_path, svg_viewbox)");

  if (recordError) { return { error: recordError }; }

  const { data: people, error: peopleError } = await supabase
    .from<Person>("people")
    .select("id, name, color");

    if (peopleError) { return { error: peopleError }; }

  const { data: stickers, error: stickerError } = await supabase
    .from<StickerModel>("stickers")
    .select("id, name, svg_path, svg_viewbox");

  if (stickerError) { return { error: stickerError }; }

  return { records, stickers, people, isLoggedIn };
};

export const action: ActionFunction = async ({ request, params }) => {
  const session = await getSession(
    request.headers.get("Cookie")
  );

  if (!session.has('userId')) {
    return { error: 'Not logged in' };
  }

  const formData = await request.formData();

  const newRecord = {
    year: formData.get('year') ?? DateTime.now().year,
    week: formData.get('week') ?? DateTime.now().weekNumber,
    people_id: formData.get('people_id'),
    sticker_id: formData.get('sticker_id')
  };

  if (!newRecord.people_id) { return { error: 'select a person' }}
  if (!newRecord.sticker_id) { return { error: 'select a sticker type' }}

  const response = await supabase
    .from<PersonSticker>("people_stickers")
    .insert(newRecord);

  return null;
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

const SKIP_WEEKS = 6;

export default function Index() {
  const { records, error, isLoggedIn } = useLoaderData<{ records: PersonSticker[], error?: string, isLoggedIn: boolean }>();
  const [showLoader, setShowLoader] = React.useState<number | null>(null);
  const today = DateTime.now();

  // TODO: support multi-year
  const weeks = new Array(today.weekNumber - SKIP_WEEKS).fill(null).map((_, i) => today.weekNumber - i);

  return (
    <main>
      {!isLoggedIn ? <Link className="login-link" to="login">Login</Link> : null}

      <h1>emmatracker???</h1>

      {error ? <div className="error">{error}</div> : null}

      <div className="calendar">
        {weeks.map(w => {
          const matches = records.filter(r => r.year === 2022 && r.week === w);
          const startDate = DateTime.fromObject({ weekYear: 2022, weekNumber: w });
          const endDate = startDate.plus({ days: 6 });


          return (
            <React.Fragment key={w}>
              <div className="week-label">
                <h2>Week {w}</h2>
                <h3>
                  {startDate.toLocaleString({ month: 'short', day: 'numeric' })}
                  {' '}???{' '}
                  {endDate.toLocaleString({ month: 'short', day: 'numeric' })}
                </h3>
              </div>

              <div className="sticker-container">
                {matches.map(m => (
                  <Sticker key={m.id} person={m.people} sticker={m.stickers} />
                ))}
              </div>

              {showLoader === w ? (
                <div style={{ position: 'relative' }}>
                  <AddWidget
                    year={2022}
                    week={w}
                    handleClose={() => setShowLoader(null)}
                  />
                </div>
              ) : (
                isLoggedIn ? <button onClick={() => setShowLoader(w)}>+</button> : <div />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </main>
  );
}
