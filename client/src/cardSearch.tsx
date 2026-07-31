import { useRef } from "react";
import cards from "./files/cards.json";
import { useImageSearch } from "./useImageSearch";
import { useCollectionContext } from "./CollectionContext";
import { ICardsProps } from "./collection";
import { parseCardName } from "./helpers";

export const CardSearch = () => {
  const { owned, toggleOwned, wished, toggleWished } = useCollectionContext();
  const {
    status,
    result,
    history,
    cameraAvailable,
    indexProgress,
    totalCards,
    searchByImage,
    reset,
    confirmResult,
    rejectResult,
  } = useImageSearch(cards as ICardsProps[]);

  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) searchByImage(file);
    e.target.value = "";
  };

  const isOwned = result ? owned.has(result.id) : false;
  const isWished = result ? wished.has(result.id) : false;

  return (
    <div className="scan-container">
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={handleFile}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />

      <div className="scan-container__main">
        {(status === "found" || status === "found_uncertain") && result ? (
          <div className="scan-container__card">
            {status === "found_uncertain" && (
              <div className="scan-container__uncertain-banner">
                <span>⚠ Uncertain result — is this your card?</span>
                <div className="scan-container__uncertain-actions">
                  <button onClick={confirmResult}>✓ Yes</button>{" "}
                  <button onClick={rejectResult}>✗ No</button>{" "}
                </div>
              </div>
            )}

            <img
              src={result.thumbnail}
              alt={result.name}
              className="scan-container__card-img"
            />

            <div className="scan-container__card-info">
              {(() => {
                const { member, index } = parseCardName(result.name);
                return (
                  <p className="scan-container__card-id">
                    <span className="scan-container__card-id-member">
                      {member}
                    </span>
                    <span className="scan-container__card-id-sep">·</span>
                    <span className="scan-container__card-id-index">
                      #{index}
                    </span>
                  </p>
                );
              })()}
              <p className="scan-container__card-era">{result.era}</p>
              <p className="scan-container__card-benefit">{result.benefit}</p>

              <div className="scan-container__card-members">
                {result.members.map((m) => (
                  <span key={m} className="scan-container__card-member">
                    {m}
                  </span>
                ))}
              </div>

              <div className="scan-container__card-states">
                <span
                  className={`scan-container__card-state ${isOwned ? "scan-container__card-state--owned" : ""}`}
                >
                  {isOwned ? "✓ Owned" : "✗ Not owned"}
                </span>
                {isWished && !isOwned && (
                  <span className="scan-container__card-state scan-container__card-state--wished">
                    ♡ Wanted
                  </span>
                )}
              </div>

              <div className="scan-container__card-actions">
                <button
                  className={`scan-container__action-btn scan-container__action-btn--check ${isOwned ? "active" : ""}`}
                  onClick={() => result && toggleOwned(result.id)}
                >
                  <i className="ti ti-circle-check" aria-hidden="true" />
                  {isOwned ? "Remove collection" : "Add collection"}
                </button>
                <button
                  className={`scan-container__action-btn scan-container__action-btn--wish ${isWished ? "active" : ""}`}
                  onClick={() => result && toggleWished(result.id)}
                  disabled={isOwned}
                >
                  <i className="ti ti-heart" aria-hidden="true" />
                  {isWished ? "Remove wishlist" : "Add wishlist"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="scan-container__preview">
            <div className="scan-container__preview-placeholder">
              <div className="scan-container__preview-icon">
                <i
                  className={
                    status === "indexing"
                      ? "ti ti-loader-2"
                      : status === "searching"
                        ? "ti ti-zoom-scan"
                        : status === "not_found"
                          ? "ti ti-zoom-cancel"
                          : status === "error"
                            ? "ti ti-alert-circle"
                            : "ti ti-camera"
                  }
                  aria-hidden="true"
                />
              </div>

              <p className="scan-container__preview-title">
                {status === "indexing"
                  ? `Processing… ${indexProgress} / ${totalCards}`
                  : status === "searching"
                    ? "Searching…"
                    : status === "not_found"
                      ? "Card not recognized"
                      : status === "error"
                        ? "An error has occured"
                        : "Scan a card"}
              </p>

              <p className="scan-container__preview-subtitle">
                {status === "indexing"
                  ? "First-time use — the app builds the map index"
                  : status === "searching"
                    ? "Analyzing the image…"
                    : status === "not_found"
                      ? "Try using better lighting or a different angle"
                      : status === "error"
                        ? "Try again"
                        : "Take a photo or import from your gallery"}
              </p>
            </div>
          </div>
        )}

        <div className="scan-container__actions">
          {cameraAvailable && (
            <button
              className="scan-container__btn scan-container__btn--camera"
              disabled={status === "indexing" || status === "searching"}
              onClick={() => {
                reset();
                cameraRef.current?.click();
              }}
            >
              <i className="ti ti-camera" aria-hidden="true" />
              {status === "found" || status === "found_uncertain"
                ? "Scanner suivante"
                : "Prendre une photo"}
            </button>
          )}
          <button
            className="scan-container__btn scan-container__btn--gallery"
            disabled={status === "searching"}
            onClick={() => {
              reset();
              galleryRef.current?.click();
            }}
          >
            <i className="ti ti-photo" aria-hidden="true" />
            Gallery
          </button>
        </div>
      </div>

      {history.length > 0 && (
        <div className="scan-container__history">
          <p className="scan-container__history-title">Current session</p>
          <div className="scan-container__history-list">
            {history.map((entry, i) => (
              <div key={i} className="scan-container__history-item">
                <img
                  src={entry.card.thumbnail}
                  alt={entry.card.name}
                  className="scan-container__history-img"
                />
                <div className="scan-container__history-info">
                  <p className="scan-container__history-name">
                    {entry.card.name}
                  </p>
                  <p
                    className={`scan-container__history-state ${owned.has(entry.card.id) ? "owned" : ""}`}
                  >
                    {owned.has(entry.card.id) ? "✓ Owned" : "✗ Not owned"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
