import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  generatePath,
  SetURLSearchParams,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import global from "./files/global";
interface IUrlProviderProps {
  /**
   * Category value in Url.
   */
  categoryParam: string;

  /**
   * Code value in Url.
   */
  codeParam: string;

  /**
   * Card ID in Url. Only defined in cardDetails component.
   */
  cardID: string | undefined;

  /**
   * Query string in Url.
   */
  searchParams: URLSearchParams;

  /**
   * Setter for searchParams.
   */
  setSearchParams: SetURLSearchParams;

  /**
   * Getter for searchParams.
   */
  getSearchParams: (value: string) => string | null;

  /**
   * Create a new Url based on parameters.
   */
  computeNewPath: (
    category: string,
    code: string,
    cardID: string | undefined,
    display: string,
  ) => void;

  /**
   * Update parameters in Url and local storage.
   */
  updateParams: (
    benefits: { name: string; checked: boolean; display: boolean }[],
    members: { name: string; checked: boolean; display: boolean }[],
  ) => void;

  /**
   * Reset Url.
   */
  resetUrl: () => void;

  displayParam: string;
  setCodeUrl: (value: string) => void;
  setCategoryUrl: (value: string) => void;
  setDisplayUrl: (value: string) => void;
}

export const UrlContext = createContext<IUrlProviderProps>({
  categoryParam: "",
  codeParam: "",
  searchParams: new URLSearchParams(),
  cardID: "",
  setSearchParams: () => {},
  getSearchParams: () => "",
  computeNewPath: () => {},
  updateParams: () => {},
  resetUrl: () => {},
  displayParam: "",
  setCodeUrl: () => {},
  setCategoryUrl: () => {},
  setDisplayUrl: () => {},
});

type Props = {
  /**
   * A React component.
   */
  children?: React.ReactNode;
};

export const UrlProvider = ({ children }: Props) => {
  const location = useLocation();
  const categoryLocalStorage = localStorage.getItem("category");
  const codeLocalStorage = localStorage.getItem("code");
  const displayLocalStorage = localStorage.getItem("display");

  const [searchParams, setSearchParams] = useSearchParams();
  const [categoryUrl, setCategoryUrl] = useState<string>(
    categoryLocalStorage
      ? JSON.parse(categoryLocalStorage)
      : global.CATEGORY_DEFAULT_VALUE,
  );
  const [codeUrl, setCodeUrl] = useState<string>(
    codeLocalStorage ? JSON.parse(codeLocalStorage) : global.ERA_DEFAULT_VALUE,
  );
  const [displayUrl, setDisplayUrl] = useState<string>(
    displayLocalStorage
      ? JSON.parse(displayLocalStorage)
      : global.DISPLAY_DEFAULT_VALUE,
  );
  const [cardIDUrl, setCardIDUrl] = useState<string>("");

  useEffect(() => {
    let currentPosition = "/";
    if (location.pathname.split("/")[4] !== undefined)
      currentPosition = "cardDetails";
    else if (location.pathname.split("/")[1].length > 0)
      currentPosition = location.pathname.split("/")[1];
    const positionLocalStorage = localStorage.getItem("position");
    const oldPosition = positionLocalStorage
      ? JSON.parse(positionLocalStorage)
      : global.POSITION_DEFAULT_VALUE;
    if (currentPosition !== "collection" && oldPosition !== "collection") {
      resetUrl();
    }

    localStorage.setItem("position", JSON.stringify(currentPosition));

    if (currentPosition != "collection")
      window.history.replaceState(null, "", location.pathname);
  }, [location.pathname]);

  /**
   * Reset Url.
   */
  const resetUrl = () => {
    setCategoryUrl(global.CATEGORY_DEFAULT_VALUE);
    setCodeUrl(global.ERA_DEFAULT_VALUE);
    setDisplayUrl(global.DISPLAY_DEFAULT_VALUE);
    localStorage.setItem(
      "benefits",
      JSON.stringify(global.BENEFITS_DEFAULT_VALUE),
    );
    localStorage.setItem(
      "members",
      JSON.stringify(global.MEMBERS_DEFAULT_VALUE),
    );
    localStorage.setItem(
      "display",
      JSON.stringify(global.DISPLAY_DEFAULT_VALUE),
    );
  };

  /**
   * Return search parameter based on its name.
   *
   * @param {string} searchParameter - name of the parameter in Url.
   *
   * @returns {string|null}
   */
  const getSearchParams = (searchParameter: string) => {
    return searchParams.get(searchParameter);
  };

  /**
   * Update parameters in Url and local storage.
   *
   * @param {{ name: string, checked: boolean, display: boolean }[]} benefits - Array representing the benefits.
   * @param {{ name: string, checked: boolean, display: boolean }[]} members - Array representing the members.
   */
  const updateParams = (
    benefits: { name: string; checked: boolean; display: boolean }[],
    members: { name: string; checked: boolean; display: boolean }[],
  ) => {
    const benefitsStringify = JSON.stringify(
      benefits
        .filter((benefit) => benefit.checked)
        .map((benefit) => benefit.name),
    );
    const membersStringify = JSON.stringify(
      members.filter((member) => member.checked).map((member) => member.name),
    );
    const newParamsStringify = {
      benefits: benefitsStringify,
      members: membersStringify,
      display: displayUrl,
    };

    localStorage.setItem("benefits", benefitsStringify);
    localStorage.setItem("members", membersStringify);
    setSearchParams(newParamsStringify, { replace: true });
  };

  /**
   * Create a new Url based on parameters.
   *
   * @param {string} category - A string representing the category.
   * @param {string} code - A string representing the album's code.
   * @param {string|undefined} cardID - A string representing the card ID selected.
   * @param {string} display - A string representing the display mode.
   */
  const computeNewPath = (
    category: string,
    code: string,
    cardID: string | undefined = undefined,
    display: string,
  ) => {
    const benefitsParams = getSearchParams("benefits") || "";
    const membersParams = getSearchParams("members") || "";

    const encodeCategory = encodeURIComponent(category);
    const encodeBenefits = encodeURIComponent(benefitsParams);
    const encodeMembers = encodeURIComponent(membersParams);
    const encodeCode = encodeURIComponent(code);

    let newPath = "";

    if (cardID) {
      setCardIDUrl(cardID);
      localStorage.setItem("cardID", JSON.stringify(cardID));
    } else {
      newPath = generatePath(`/collection/:categoryParam/:codeParam`, {
        categoryParam: encodeCategory,
        codeParam: encodeCode,
      });
      newPath += `?benefits=${encodeBenefits}&members=${encodeMembers}&display=${display}`;
      setCategoryUrl(encodeCategory);
      setCodeUrl(encodeCode);
      setDisplayUrl(display);
      localStorage.setItem("category", JSON.stringify(encodeCategory));
      localStorage.setItem("code", JSON.stringify(code));
      localStorage.setItem("display", JSON.stringify(display));
    }
    window.history.replaceState(null, "", newPath);
  };

  const authValue: IUrlProviderProps = {
    categoryParam: categoryUrl,
    codeParam: codeUrl,
    cardID: cardIDUrl,
    searchParams: searchParams,
    setSearchParams: setSearchParams,
    getSearchParams: getSearchParams,
    computeNewPath: computeNewPath,
    updateParams: updateParams,
    resetUrl: resetUrl,
    displayParam: displayUrl,
    setCodeUrl: setCodeUrl,
    setCategoryUrl: setCategoryUrl,
    setDisplayUrl: setDisplayUrl,
  };

  return (
    <UrlContext.Provider value={authValue}>{children}</UrlContext.Provider>
  );
};

UrlProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
