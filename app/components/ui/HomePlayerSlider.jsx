"use client";

import { useEffect, useState } from "react";

export default function HomePlayerSlider({ locale = "ar" }) {
  const [players, setPlayers] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const english = locale === "en";

  useEffect(() => {
    let active = true;
    fetch("/api/content/players", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : [])
      .then((items) => { if (active && Array.isArray(items)) setPlayers(items); })
      .catch(() => {})
      .finally(() => { if (active) setLoaded(true); });
    return () => { active = false; };
  }, []);

  if (!loaded) return <div className="players-window" aria-busy="true" />;
  if (!players.length) return <p className="player-note">{english ? "Player cards will appear here when added in the admin panel." : "ستظهر بطاقات اللاعبين هنا بعد إضافتها من لوحة التحكم."}</p>;

  // Keep the marquee filled even when the academy has only a few player cards.
  const repeats = Math.max(1, Math.ceil(6 / players.length));
  const loopItems = Array.from({ length: repeats }, () => players).flat();
  const playerName = (player) => english ? (player.nameEn || player.name) : (player.name || player.nameEn);
  const localized = (player, key) => english ? (player[`${key}En`] || player[key]) : (player[key] || player[`${key}En`]);
  const renderGroup = (copy) => <div className="players-group" lang={locale} aria-hidden={copy === 1 || undefined} key={copy}>
    {loopItems.map((player, index) => <article className="player-card" key={`${copy}-${player.id}-${index}`}>
      <div className="player-portrait"><img className="player-real-image" src={player.cardImage} alt={copy === 1 ? "" : playerName(player)} loading="lazy" /></div>
      <div className="player-info">
        <h3>{playerName(player)}</h3>
        <div className="player-detail"><span>{english ? "Sport" : "الرياضة"}</span><b>{localized(player, "sport")}</b></div>
        <div className="player-detail"><span>{english ? "Playing period" : "فترة اللعب"}</span><b>{localized(player, "playingPeriod")}</b></div>
      </div>
    </article>)}
  </div>;

  return <div className="players-window" aria-label={english ? "Featured players" : "اللاعبون المميزون"}>
    <div className="players-track">{renderGroup(0)}{renderGroup(1)}</div>
  </div>;
}
