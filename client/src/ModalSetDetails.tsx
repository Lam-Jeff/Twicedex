import { Link } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import cardsFile from "./files/cards.json";
import { AuthContext } from "./authProvider";
import { StatsInfo } from "./stats";
import { RxChevronRight } from "react-icons/rx";
import {
  computeProgressionByBenefitsAndEra,
  computeProgressionByMemberAndEra,
} from "./helpers";
import { UrlContext } from "./urlProvider";
import benefitsFile from "./files/benefits.json";
import membersFile from "./files/members.json";
interface IModalSetDetails {
  album: { name: string; code: string; image: string };
  category: string;
  isModalSetDetailsOpen: boolean;
  setIsModalSetDetailsOpen: (value: boolean) => void;
  progression: Record<
    string,
    {
      percent: number;
      acquired: number;
      total: number;
    }
  >;
}

export const ModalSetDetails = ({
  album,
  category,
  isModalSetDetailsOpen,
  setIsModalSetDetailsOpen,
  progression,
}: IModalSetDetails) => {
  const { user, cardsData } = useContext(AuthContext);
  const { setCodeUrl, setCategoryUrl, updateParams } = useContext(UrlContext);
  const [currentAlbum, setCurrentAlbum] = useState(album.name);
  const [benefits, setBenefits] = useState<
    {
      benefit: string;
      progression: {
        percent: number;
        acquired: number;
        total: number;
      };
    }[]
  >([]);
  const [members, setMembers] = useState<
    {
      member: string;
      progression: {
        percent: number;
        acquired: number;
        total: number;
      };
    }[]
  >([]);

  const refModal = useRef<null | HTMLDivElement>(null);

  if (currentAlbum != album.name && album.name.length > 0) {
    refModal.current?.scrollTo(0, 0);
    let newMembers: {
      member: string;
      progression: {
        percent: number;
        acquired: number;
        total: number;
      };
    }[] = [];
    let newBenefits: {
      benefit: string;
      progression: {
        percent: number;
        acquired: number;
        total: number;
      };
    }[] = [];
    const newCards = cardsFile.filter(
      (card) => card.era === album.name && card.categories.includes(category),
    );
    const progressionMembers = computeProgressionByMemberAndEra(
      cardsData,
      newCards,
    );
    const progressionBenefits = computeProgressionByBenefitsAndEra(
      cardsData,
      newCards,
    );
    newBenefits = Object.entries(progressionBenefits).map(([key, value]) => ({
      benefit: key,
      progression: value,
    }));
    newMembers = Object.entries(progressionMembers).map(([key, value]) => ({
      member: key,
      progression: value,
    }));
    setBenefits(newBenefits);
    setMembers(newMembers);
    setCurrentAlbum(album.name);
  }

  const handleClickOnLink = (type: string, value: string) => {
    setIsModalSetDetailsOpen(false);
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = "0px";
    const currentBenefitsName = benefits.map((_benefit) => _benefit.benefit);
    const currentMembersName = members.map((_member) => _member.member);
    let newBenefits = benefitsFile.map((_benefit) =>
      currentBenefitsName.includes(_benefit.name)
        ? { ..._benefit, display: true, checked: true }
        : { ..._benefit, display: false, checked: false },
    );
    let newMembers = membersFile.map((_member) =>
      currentMembersName.includes(_member.name)
        ? { ..._member, display: true, checked: true }
        : { ..._member, display: false, checked: false },
    );
    switch (type) {
      case "benefit":
        newBenefits = newBenefits.map((_benefit) =>
          _benefit.name === value
            ? { ..._benefit, checked: true }
            : { ..._benefit, checked: false },
        );
        break;
      case "member":
        newMembers = newMembers.map((_member) =>
          _member.name === value
            ? { ..._member, checked: true }
            : { ..._member, checked: false },
        );
        break;
      default:
        break;
    }
    setCodeUrl(album.code);
    setCategoryUrl(category);
    updateParams(newBenefits, newMembers);
  };

  const handleClickOnClose = () => {
    setIsModalSetDetailsOpen(false);
    setCurrentAlbum("");
    refModal.current?.scrollTo(0, 0);
  };

  return (
    <div
      className="modal-set-details-container"
      style={{
        transform: `${isModalSetDetailsOpen ? "translateX(0)" : "translateX(-200%)"}`,
      }}
    >
      <div className="modal-set-details-container__top">
        <h2>
          {album.name} <span>{album.code}</span>
        </h2>
      </div>

      <div className="modal-set-details-container__body" ref={refModal}>
        <div className="modal-set-details-container__body__header">
          <img src={album.image} alt={`${album.name} logo`} />
          <div className="modal-set-details-container__body__header__owned-resume">
            <div className="modal-set-details-container__body__header__owned-resume-box">
              <span>
                {progression[album.name] ? progression[album.name].acquired : 0}
              </span>
              <p>Total cards owned</p>
            </div>
          </div>
        </div>

        <div className="modal-set-details-container__body__main">
          <div className="modal-set-details-container__body__main__quick-access">
            <h3>Quick access</h3>
            <Link
              to={`/collection/${encodeURIComponent(category)}/${encodeURIComponent(album.code)}`}
              state={{ radioType: "All" }}
              onClick={() => handleClickOnLink("all", "all")}
              replace
            >
              All cards
              <RxChevronRight />
            </Link>
            <Link
              to={`/collection/${encodeURIComponent(category)}/${encodeURIComponent(album.code)}`}
              state={{ radioType: "In collection" }}
              className={!user ? "disabled" : ""}
              onClick={() => handleClickOnLink("all", "collection")}
              replace
            >
              Cards in collection
              <RxChevronRight />
            </Link>
            <Link
              to={`/collection/${encodeURIComponent(category)}/${encodeURIComponent(album.code)}`}
              state={{ radioType: "In wishlist" }}
              className={!user ? "disabled" : ""}
              onClick={() => handleClickOnLink("all", "wishlist")}
              replace
            >
              Cards in wishlist
              <RxChevronRight />
            </Link>
          </div>
          <div className="modal-set-details-container__body__main__benefit-progress">
            <h3>Benefit progress</h3>
            {benefits.map((object) => {
              return (
                <Link
                  to={`/collection/${encodeURIComponent(category)}/${encodeURIComponent(album.code)}`}
                  key={`link-collection-with-benefit-${object.benefit}`}
                  onClick={() => handleClickOnLink("benefit", object.benefit)}
                  replace
                >
                  {object.benefit}
                  <StatsInfo
                    album={{ name: object.benefit, code: object.benefit }}
                    progression={object.progression}
                  />
                </Link>
              );
            })}
          </div>
          <div className="modal-set-details-container__body__main__member-progress">
            <h3>Member progress</h3>
            {members.map((object) => {
              return (
                <Link
                  to={`/collection/${encodeURIComponent(category)}/${encodeURIComponent(album.code)}`}
                  key={`link-collection-with-member-${object.member}`}
                  onClick={() => handleClickOnLink("member", object.member)}
                  replace
                >
                  {object.member}
                  <StatsInfo
                    album={{ name: object.member, code: object.member }}
                    progression={object.progression}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <div className="modal-set-details-container__bottom">
        <button onClick={handleClickOnClose}>Close</button>
      </div>
    </div>
  );
};

