import React, { useState, useEffect, isValidElement } from "react";
import define from "../../config/define";

const SearchInput = ({ defaultValue, search, placeholder }) => {
  const [keyword, setKeyword] = useState("");
  const onInput = (e) => {
    const { value } = e.target;
    setKeyword(value);
  };

  useEffect(() => {
    if (defaultValue) {
      setKeyword("");
    }
  }, [defaultValue]);

  const onEnter = (e) => {
    if (e.key === "Enter") {
      search(keyword);
    }
  };

  return (
    <>
      <input
        type="text"
        placeholder={placeholder}
        value={keyword}
        onChange={onInput}
        onKeyPress={onEnter}
        style={{
          width: "21rem",
          height: "100%",
          borderBottom: "1px solid gainsboro",
        }}
      />
      <button
        type="button"
        onClick={() => search(keyword)}
        style={{
          width: "2.5rem",
          height: "100%",
          backgroundImage: `url("${define.CDN_HOST}/assets/ico-search.png")`,
          backgroundSize: "cover",
        }}
      ></button>
    </>
  );
};

export default SearchInput;
