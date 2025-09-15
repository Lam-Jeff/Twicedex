import { createContext, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import {
  generatePath,
  SetURLSearchParams,
  useLocation,
  useSearchParams,
  useNavigate,
  useParams,
} from "react-router-dom";
import global from "./files/global";
import { getInitialValue, optionToCode } from "./helpers";
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
   * Option in Url.
   */
  optionParam: string;

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
    option: string,
  ) => void;

  /**
   * Update parameters in Url and local storage.
   */
  updateParams: (
    benefits: { name: string; checked: boolean; display: boolean }[],
    members: { name: string; checked: boolean; display: boolean }[],
    option: string,
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
  optionParam: "",
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
  const navigate = useNavigate();
  const params = useParams();
  const hasNavigatedBack = useRef(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const [categoryUrl, setCategoryUrl] = useState<string>(
    getInitialValue(
      "category",
      global.CATEGORY_DEFAULT_VALUE,
      params.categoryParam,
    ),
  );
  const [codeUrl, setCodeUrl] = useState<string>(
    getInitialValue("code", global.ERA_DEFAULT_VALUE, params.codeParam),
  );
  const [displayUrl, setDisplayUrl] = useState<string>(
    getInitialValue(
      "display",
      global.DISPLAY_DEFAULT_VALUE,
      searchParams.get("display"),
    ),
  );
  const [cardIDUrl, setCardIDUrl] = useState<string>("");
  const [optionUrl, setOptionUrl] = useState<string>(
    getInitialValue(
      "option",
      global.OPTION_DEFAULT_VALUE,
      searchParams.get("option"),
    ),
  );

  useEffect(() => {
    const isFirstLoad = !sessionStorage.getItem("hasLoaded");
    let isBackNavigation = false;
    let currentPosition = "/";
    if (location.pathname.split("/")[4] !== undefined)
      currentPosition = "cardDetails";
    else if (location.pathname.split("/")[1].length > 0)
      currentPosition = location.pathname.split("/")[1];
    const positionSessionStorage = sessionStorage.getItem("position");
    const oldPosition = positionSessionStorage
      ? JSON.parse(positionSessionStorage)
      : global.POSITION_DEFAULT_VALUE;

    if (isFirstLoad) {
      sessionStorage.setItem("hasLoaded", "true");
      return;
    }

    if (oldPosition !== currentPosition) {
      const referrer = document.referrer;

      if (!["collection", "sets"].includes(oldPosition)) {
        resetUrl();
      }

      if (
        referrer &&
        referrer.startsWith(window.location.origin) &&
        referrer.includes(oldPosition)
      ) {
        isBackNavigation = true;
      } else if (!referrer) {
        isBackNavigation = false;
      }
    }

    if (!hasNavigatedBack.current && isBackNavigation) {
      hasNavigatedBack.current = true;

      navigate(-1);
      return;
    }

    sessionStorage.setItem("position", JSON.stringify(currentPosition));
    window.history.replaceState(null, "", location.pathname);
  }, [location.pathname]);

  /**
   * Reset Url.
   */
  const resetUrl = () => {
    setCategoryUrl(global.CATEGORY_DEFAULT_VALUE);
    setCodeUrl(global.ERA_DEFAULT_VALUE);
    setDisplayUrl(global.DISPLAY_DEFAULT_VALUE);
    setOptionUrl(global.OPTION_DEFAULT_VALUE);
    sessionStorage.setItem("benefits", JSON.stringify([]));
    sessionStorage.setItem("members", JSON.stringify([]));
    sessionStorage.setItem(
      "display",
      JSON.stringify(global.DISPLAY_DEFAULT_VALUE),
    );
    sessionStorage.setItem(
      "option",
      JSON.stringify(global.OPTION_DEFAULT_VALUE),
    );
  };

  /**
   * Return search parameter based on its name.
   *
   * @param {string} searchParameters - name of the parameter in Url.
   *
   * @returns {string|null}
   */
  const getSearchParams = (searchParameters: string) => {
    return searchParams.get(searchParameters);
  };

  /**
   * Update parameters in Url and session storage.
   *
   * @param {{ name: string, checked: boolean, display: boolean }[]} benefits - Array representing the benefits.
   * @param {{ name: string, checked: boolean, display: boolean }[]} members - Array representing the members.
   * @param {string} option - String representing the type of cards daatabase to display.
   */
  const updateParams = (
    benefits: { name: string; checked: boolean; display: boolean }[],
    members: { name: string; checked: boolean; display: boolean }[],
    option: string,
  ) => {
    const benefitsStringify = JSON.stringify(
      benefits
        .filter((benefit) => benefit.checked)
        .map((benefit) => benefit.name),
    );
    const membersStringify = JSON.stringify(
      members.filter((member) => member.checked).map((member) => member.name),
    );

    const optionCode = optionToCode(option);
    const optionCodeStringify = JSON.stringify(optionCode);
    const newParamsStringify = {
      benefits: benefitsStringify,
      members: membersStringify,
      display: displayUrl,
      option: optionCodeStringify,
    };
    sessionStorage.setItem("benefits", benefitsStringify);
    sessionStorage.setItem("members", membersStringify);
    sessionStorage.setItem("option", optionCodeStringify);
    setOptionUrl(optionCode);
    setSearchParams(newParamsStringify, { replace: true });
  };

  /**
   * Create a new Url based on parameters.
   *
   * @param {string} category - A string representing the category.
   * @param {string} code - A string representing the album's code.
   * @param {string|undefined} cardID - A string representing the card ID selected.
   * @param {string} display - A string representing the display mode.
   * @param {string} option - A String representing the cards database to display.
   */
  const computeNewPath = (
    category: string,
    code: string,
    cardID: string | undefined = undefined,
    display: string,
    option: string,
  ) => {
    const benefitsParams = getSearchParams("benefits") || "";
    const membersParams = getSearchParams("members") || "";

    const encodeCategory = encodeURIComponent(category);
    const encodeBenefits = encodeURIComponent(benefitsParams);
    const encodeMembers = encodeURIComponent(membersParams);
    const encodeCode = encodeURIComponent(code);
    const encodeOption = encodeURIComponent(option);

    let newPath = "";

    if (cardID) {
      setCardIDUrl(cardID);
      sessionStorage.setItem("cardID", JSON.stringify(cardID));
    } else {
      newPath = generatePath(`/collection/:categoryParam/:codeParam`, {
        categoryParam: encodeCategory,
        codeParam: encodeCode,
      });
      newPath += `?benefits=${encodeBenefits}&members=${encodeMembers}&display=${display}&option=${encodeOption}`;
      setCategoryUrl(encodeCategory);
      setCodeUrl(encodeCode);
      setOptionUrl(option);
      setDisplayUrl(display);
      sessionStorage.setItem("category", JSON.stringify(encodeCategory));
      sessionStorage.setItem("code", JSON.stringify(code));
      sessionStorage.setItem("display", JSON.stringify(display));
      sessionStorage.setItem("option", JSON.stringify(option));
    }
    window.history.replaceState(null, "", newPath);
  };

  const authValue: IUrlProviderProps = {
    categoryParam: categoryUrl,
    codeParam: codeUrl,
    cardID: cardIDUrl,
    optionParam: optionUrl,
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
