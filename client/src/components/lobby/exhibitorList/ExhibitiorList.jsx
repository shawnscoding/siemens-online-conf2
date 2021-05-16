import React, { useContext, useEffect, useState } from "react";
import { LobbyContext } from "../../../store/lobby/LobbyContext";
import ExhibitorListTable from "./ExhibitorListTable";
import SearchInput from "../../common/SearchInput";
import { apiClient } from "../../../utils/data/api";
import define from "../../../config/define";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../store/auth/AuthContext";
import NotAuthExhibitorListTable from "./NotAuthExhibitorListTable";
import styled from "styled-components";

const AlertOpener = styled.button`
  font-size: 1.8rem;
`;

const ExhibitiorList = () => {
  const { openNotAuthenticatedAlert } = React.useContext(LobbyContext);
  const { setModalManager } = useContext(LobbyContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [exhibitorList, setExhibitorList] = useState([]);
  const [defaultValue, setDefault] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const handleClose = () => {
    setModalManager((prev) => ({
      ...prev,
      exhibitorList: {
        open: false,
      },
    }));
  };

  const getExhibitorList = async (query) => {
    if (loading) return;

    try {
      setLoading(true);
      const response = await apiClient.get(`/company/search?${query}`);
      const { data } = response;
      if (!Array.isArray(data) || !data.length) {
        setLoading(false);
        return "";
      }
      setLoading(false);
      setDefault(false);
      setExhibitorList(data);
    } catch (error) {
      setLoading(false);
      console.error("getExhibitiorList error ::", error);
    }
  };

  useEffect(() => {
    getExhibitorList("");
    return () => {};
  }, []);

  // 로딩
  return (
    <div className="popup modal on">
      <div className="pop-tb">
        <div className="pop-cell zoomIn">
          <div className="modal-box">
            <div className="modal-header">
              <h2>Exhibitor List</h2>
              <button type="button" className="close" onClick={handleClose}>
                close
              </button>
            </div>
            <div className="pop-content exhibitorList">
              <div className="content-box" style={{ height: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    position: "relative",
                    margin: "0 2rem 1.5rem 2rem",
                  }}
                >
                  <div style={{ position: "relative", height: "2.5rem" }}>
                    <SearchInput
                      defaultValue={defaultValue}
                      search={(keyword) => (
                        setDefault(true),
                        getExhibitorList(
                          keyword
                            ? `keyword=${encodeURIComponent(keyword)}`
                            : ""
                        )
                      )}
                      placeholder="기업명, 제품명 검색"
                    />
                  </div>
                  <span
                    className="search-refresh"
                    style={{
                      display: "block",
                      width: "2.2rem",
                      height: "2.2rem",
                      backgroundImage: `url("${define.CDN_HOST}/assets/ico-refresh.png")`,
                      backgroundSize: "cover",
                    }}
                    onClick={() => (setDefault(true), getExhibitorList(""))}
                  >
                    {" "}
                  </span>
                </div>
                {isAuthenticated ? (
                  <ExhibitorListTable
                    options={{
                      columns: [
                        {
                          key: "",
                          name: "연번",
                          formatter: (rowData) => {
                            return <td />;
                          },
                        },
                        {
                          key: "name",
                          name: "기업명",
                          formatter: (rowData) => {
                            const { name, idx } = rowData;
                            return <td key={`${name}_${idx}`}>{name}</td>;
                          },
                        },
                        {
                          key: "product",
                          name: "기업 소개",
                          formatter: (rowData) => {
                            const { product, idx } = rowData;
                            return <td key={`${product}_${idx}`}>{product}</td>;
                          },
                        },
                        {
                          key: "location",
                          name: "위치",
                          formatter: (rowData) => {
                            const { location, sort_order, idx } = rowData;
                            return (
                              <td key={`${location}_${sort_order}`}>
                                <Link to={`/booth/${idx}`}>방문하기</Link>
                              </td>
                            );
                          },
                        },
                      ],
                      data: exhibitorList,
                      isPaginating: true,
                      baseNumber: 10,
                      totalSize: exhibitorList.length,
                      defaultValue,
                      setDefault,
                    }}
                    style={{ padding: 0 }}
                  />
                ) : (
                  <NotAuthExhibitorListTable
                    options={{
                      columns: [
                        {
                          key: "",
                          name: "연번",
                          formatter: (rowData) => {
                            return <td />;
                          },
                        },
                        {
                          key: "name",
                          name: "기업명",
                          formatter: (rowData) => {
                            const { name, idx } = rowData;
                            return <td key={`${name}_${idx}`}>{name}</td>;
                          },
                        },
                        {
                          key: "product",
                          name: "기업 소개",
                          formatter: (rowData) => {
                            const { product, idx } = rowData;
                            return <td key={`${product}_${idx}`}>{product}</td>;
                          },
                        },
                        {
                          key: "location",
                          name: "위치",
                          formatter: (rowData) => {
                            const { location, sort_order, idx } = rowData;
                            return (
                              <td key={`${location}_${sort_order}`}>
                                <AlertOpener
                                  onClick={openNotAuthenticatedAlert}
                                  type="button"
                                >
                                  방문하기
                                </AlertOpener>
                              </td>
                            );
                          },
                        },
                      ],
                      data: exhibitorList,
                      isPaginating: true,
                      baseNumber: 10,
                      totalSize: exhibitorList.length,
                      defaultValue,
                      setDefault,
                    }}
                    style={{ padding: 0 }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExhibitiorList;
