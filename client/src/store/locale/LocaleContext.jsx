import React, { useEffect, useState, createContext } from "react";
import { findLocaleInStorage } from "../../utils/helper";
import { IntlProvider, addLocaleData } from "react-intl";
import locale from "../../utils/data/locale";

const loadLocaleDataByAcceptHeader = (locale) => {
  switch (locale) {
    case "kr":
      return import("../../compiled-lang/kr.json");
    default:
      return import("../../compiled-lang/en.json");
  }
};

const LocaleContext = createContext(null);

const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState({
    locale: localStorage.getItem("lang") || "en",
    msgs: null,
  });
  const defaultLang = localStorage.getItem("lang") || "en";
  const handleLangSubmit = async (lang) => {
    const msgs = await loadLocaleDataByAcceptHeader(lang);

    localStorage.setItem("locale", lang);

    setLocale({
      locale: lang,
      msgs,
    });
  };
  // did user set lang preference explicitly?
  // const [localeInStorage, setlocaleInStorage] = useState(findLocaleInStorage());

  useEffect(() => {
    const getLocale = async () => {
      const localeInStorage = findLocaleInStorage();
      // console.log("localeInStorage ::", localeInStorage);
      if (!localeInStorage) {
        // detect accept Lang Header
        let language =
          window.navigator.userLanguage || window.navigator.language;
        // console.log("language ::", language);
        if (language === "ko-KR") {
          language = "kr";
        } else {
          language = "en";
        }

        const msgs = await loadLocaleDataByAcceptHeader(language);

        setLocale({
          msgs: msgs,
          locale: language,
        });
      } else {
        const msgs = await loadLocaleDataByAcceptHeader(localeInStorage);
        setLocale({
          msgs: msgs,
          locale: localeInStorage,
        });
      }
    };
    getLocale();
  }, []);

  // console.log("locale :: ", locale);

  const store = {
    locale,
    handleLangSubmit,
  };

  return (
    <LocaleContext.Provider value={store}>
      <IntlProvider locale={defaultLang}>{children}</IntlProvider>
    </LocaleContext.Provider>
  );
};

export { LocaleProvider, LocaleContext };
