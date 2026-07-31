import { useContext, useEffect } from "react";
import { BsFillCircleFill } from "react-icons/bs";
import { filterByAlbumAndCategory, parseCardName } from "./helpers";
import { useParams } from "react-router-dom";
import cardsFile from "./files/cards.json";
import albumsFile from "./files/albums.json";
import { UrlContext } from "./urlProvider";

export const CardDetails = () => {
  const { cardID } = useParams();
  const decodedCardID = decodeURIComponent(cardID ?? "");
  const {
    computeNewPath,
    categoryParam,
    codeParam,
    displayParam,
    optionParam,
  } = useContext(UrlContext);
  const album = albumsFile.find(
    (album) => album.code === cardID?.split("_")[1],
  );
  const cardsToDisplay = filterByAlbumAndCategory(
    cardsFile,
    album?.name ?? "The Story Begins",
    decodeURIComponent(categoryParam) ?? "Korean Albums",
  );
  const indexCard = cardsToDisplay.findIndex(
    (card) => card.name === decodedCardID,
  );

  useEffect(() => {
    computeNewPath(
      decodeURIComponent(categoryParam),
      decodeURIComponent(codeParam),
      decodedCardID,
      displayParam,
      optionParam,
    );
  }, []);

  return (
    <div className="card-details-container">
      <div className="card-details-container__card">
        <div className="card-details-container__card-image">
          <img
            src={cardsToDisplay[indexCard]?.thumbnail}
            alt={cardsToDisplay[indexCard]?.name}
          />
        </div>
        <div className="card-details-container__card-info">
          <div className="card-details-container__card-info__header">
            <div className="card-details-container__card-info__header-title">
              {(() => {
                const { member, index } = parseCardName(
                  cardsToDisplay[indexCard].name,
                );
                return (
                  <p className="card-details-container__card-info__header-title__card-id">
                    <span className="card-details-container__card-info__header-title__card-id-member">
                      {member}
                    </span>
                    <span className="card-details-container__card-info__header-title__card-id-sep">
                      ·
                    </span>
                    <span className="card-details-container__card-info__header-title__card-id-index">
                      #{index}
                    </span>
                  </p>
                );
              })()}
              <div className="card-details-container__card-info__header-title__badge">
                <span className="card-details-container__card-info__header-title__badge-number">
                  {cardsToDisplay[indexCard]?.id}
                </span>
              </div>
            </div>

            <h4>{cardsToDisplay[indexCard]?.era}</h4>
          </div>
          <div className="card-details-container__card-info__body">
            <div className="card-details-container__card-info__body-number">
              <div className="card-details-container__card-info__body-number-title">
                #
              </div>
              <div>
                <p>
                  {indexCard + 1}/{cardsToDisplay.length}
                </p>
              </div>
            </div>
            <div className="card-details-container__card-info__body-members">
              <div className="card-details-container__card-info__body-members-title">
                Member(s)
              </div>
              <div className="card-details-container__card-info__body-members-box">
                {cardsToDisplay[indexCard]?.members.map((member, index) => {
                  return (
                    <div
                      key={`p_members_${index}`}
                      className={`member-chip member-chip--${member}`}
                    >
                      <span className="member-chip__name"> {member}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="card-details-container__card-info__body-categories">
              <div className="card-details-container__card-info__body-categories-title">
                Categories
              </div>
              <div>
                {cardsToDisplay[indexCard]?.categories.map(
                  (category, index) => {
                    return <p key={`p_category_${index}`}>{category}</p>;
                  },
                )}
              </div>
            </div>
            <div className="card-details-container__card-info__body-benefit">
              <div className="card-details-container__card-info__body-benefit-title">
                Benefit
              </div>
              <div>
                <p>{cardsToDisplay[indexCard]?.benefit}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
