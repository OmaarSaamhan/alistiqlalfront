"use client";

import { useRef } from "react";

export default function EventGallery({ images, title, english = false }) {
  const dialogRef = useRef(null);
  const photoList = Array.isArray(images) ? images.filter(Boolean) : [];
  const preview = photoList[0];
  if (!preview) return null;

  return <>
    <button
      className="event-gallery-preview"
      type="button"
      aria-haspopup="dialog"
      onClick={() => dialogRef.current?.showModal()}
    >
      <img src={preview} alt={title} loading="eager" />
      <span className="event-gallery-overlay">
        <b>{english ? "View photo gallery" : "عرض معرض الصور"}</b>
        <small>{english ? `${photoList.length} photos` : `${photoList.length} صور`}</small>
      </span>
    </button>

    <dialog
      ref={dialogRef}
      className="event-gallery-dialog"
      aria-label={english ? `Photo gallery: ${title}` : `معرض صور ${title}`}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current.close();
      }}
    >
      <div className="gallery-dialog-head">
        <h2>{english ? `Photo gallery: ${title}` : `معرض الصور: ${title}`}</h2>
        <button className="gallery-dialog-close" type="button" aria-label={english ? "Close gallery" : "إغلاق المعرض"} onClick={() => dialogRef.current?.close()}>×</button>
      </div>
      <div className="gallery-dialog-grid">
        {photoList.map((image, index) => <a className="gallery-dialog-image" href={image} target="_blank" rel="noreferrer" key={`${image}-${index}`}>
          <img src={image} alt={`${title} — ${index + 1}`} loading={index < 3 ? "eager" : "lazy"} />
        </a>)}
      </div>
    </dialog>
  </>;
}
