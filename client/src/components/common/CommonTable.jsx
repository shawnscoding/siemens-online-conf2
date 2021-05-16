import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const CommonTable = ({ options }) => {
  const {
    columns,
    data = [],
    isPaginating,
    baseNumber,
    totalSize = 0,
    onPaginationClick = () => {},
    defaultValue,
  } = options;
  const [offset, setOffset] = useState(0);
  const [slicedData, setSlicedData] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pagination, setPagination] = useState([]);
  const pageNums = Math.ceil(totalSize / baseNumber);
  const renderSinglePageIndex = (value, onClick) => {
    return (
      <li key={value} style={{ margin: "0 0.25rem" }}>
        <button type="button" onClick={() => onClick(value)}>
          <span
            style={{
              fontWeight: pageIndex === value ? "bold" : "normal",
              fontSize: "1.6rem",
            }}
          >
            {value}
          </span>
        </button>
      </li>
    );
  };

  const renderRow = (rowData, rowIndex) => {
    const tds = Object.keys(rowData)
      .map((key) => {
        const idx = columns.findIndex((col) => {
          return col.key === key;
        });
        return idx > -1 ? idx : null;
      })
      .filter((v) => v !== null)
      .sort((a, b) => a - b)
      .map((v, idx) => v >= 0 && columns[v].formatter(rowData, idx));
    return (
      <tr
        className="replayList__tr rejected"
        style={{ color: "white" }}
        key={rowData.idx}
      >
        <td>{rowIndex + 1 + offset}</td>
        {tds}
      </tr>
    );
  };

  const updateData = async (index) => {
    await onPaginationClick(`pageNo=${index}`);
    setOffset(baseNumber * (index - 1));
  };

  const generatePageIndexArr = () => {
    if (!pageNums) return [];
    const pageNumArr = [];
    const pageIndexGroupNum = Math.ceil(pageNums / baseNumber);
    for (let i = 0; i < pageIndexGroupNum; i++) {
      const arr = [];
      for (let j = i * baseNumber; j < baseNumber * (i + 1); j++) {
        if (j === pageNums) break;
        arr.push(j + 1);
        pageNumArr[i] = arr;
      }
    }
    setPagination(pageNumArr);
  };

  const renderPagination = () => {
    if (!pageNums || !pagination.length) return [];
    return [
      renderSinglePageIndex(
        "이전",
        () =>
          pageIndex > 1 &&
          (updateData(pageIndex - 1), setPageIndex(pageIndex - 1))
      ),
      ...pagination
        .filter((arr) => arr.includes(pageIndex))
        .map((v) => {
          return v.map((i) =>
            renderSinglePageIndex(i, () => (updateData(i), setPageIndex(i)))
          );
        }),
      renderSinglePageIndex(
        "다음",
        () =>
          pageIndex > 0 &&
          pageIndex < pageNums &&
          (updateData(pageIndex + 1), setPageIndex(pageIndex + 1))
      ),
    ];
  };

  useEffect(() => {
    if (isPaginating && data.length) {
      generatePageIndexArr();
    }
  }, [data]);

  useEffect(() => {
    if (!defaultValue) {
      setOffset(0);
      setPageIndex(1);
    }
  }, [defaultValue]);

  return (
    <div
      className="table"
      style={{
        position: "relative",
      }}
    >
      <div className="tb-wrap">
        <table className="center">
          <caption className="sr-only">table</caption>
          <colgroup>
            {columns.map((v, i) => {
              const { style } = v;
              return <col key={i} style={style || { width: "auto" }} />;
            })}
          </colgroup>
          <thead>
            <tr>
              {columns.map((v, i) => (
                <th key={i} scope="col" style={{ fontSize: "1.6rem" }}>
                  {v.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!data.length ? (
              <tr>
                <td colSpan={columns.length}>목록이 없습니다</td>
              </tr>
            ) : (
              data.map((v, index) => renderRow(v, index))
            )}
          </tbody>
        </table>
      </div>
      {isPaginating ? (
        <div
          className="table pagination"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: "65rem",
            width: "65rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ul>{renderPagination()}</ul>
        </div>
      ) : null}
    </div>
  );
};

CommonTable.propTypes = {
  options: PropTypes.shape({
    data: PropTypes.array,
    columns: PropTypes.array,
    isPaginating: PropTypes.bool,
    totalSize: PropTypes.number,
    baseNumber: PropTypes.number,
    onPaginationClick: PropTypes.func,
    defaultValue: PropTypes.bool,
  }).isRequired,
};

export default CommonTable;
