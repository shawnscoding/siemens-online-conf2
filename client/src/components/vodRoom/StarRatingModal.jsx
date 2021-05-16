import React from "react";
import { AuthContext } from "../../store/auth/AuthContext";
import { apiClient } from "../../utils/data/api";
import Rating from "@material-ui/lab/Rating";
import { LobbyContext } from "../../store/lobby/LobbyContext";
import styled from "styled-components";
import Radio from "../common/radio/Radio";

const RadioContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 8px 0 0px 0;
`;

const RadioText = styled.p`
  font-size: 2rem;
  text-align: center;
`;

const StarRatingModal = ({
  handleClose,
  handleVodClose,
  currentConference,
}) => {
  const { user } = React.useContext(AuthContext);
  const { setModalManager } = React.useContext(LobbyContext);

  const [form, setForm] = React.useState({
    stars: 5,
    is_help_needed: null,
  });

  const [msg, setMsg] = React.useState(null);

  const onSubmit = async () => {
    if (!form.stars) return;
    // if (!currentConference) return;
    if (!form.is_help_needed) {
      setMsg("발표 내용 관련 설문 항목에 체크를 해주세요");
      return;
    }
    const body = {
      rating: form.stars,
      conference_idx: currentConference.idx,
      user_idx: user.idx,
      is_help_needed: form.is_help_needed,
    };

    try {
      await apiClient.post("/userConferenceRating", body);
      setMsg(null);
      handleVodClose();
      handleClose();
      setModalManager((prev) => ({
        ...prev,
        programInfo: {
          open: true,
        },
      }));
      return;
    } catch (err) {
      console.log("err ::", err);
    }
  };

  const onRadioChange = (e) => {
    const { name, id } = e.target;
    console.log("name ", name);
    console.log("id ", id);
    setForm((prev) => ({
      ...prev,
      [name]: id,
    }));
  };

  return (
    <>
      <div
        style={{
          zIndex: 99999,
        }}
        className="popup modal on"
      >
        <div
          style={{
            maxWidth: "70rem",
          }}
          className="pop-tb"
        >
          <div className="pop-cell zoomIn">
            <div
              style={{
                maxHeight: "40rem",
              }}
              className="modal-box"
            >
              <div className="modal-header">
                <h2>Rate the session</h2>
              </div>
              <div
                style={{
                  margin: "27px 0 20px 0",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Rating
                  name="size-large"
                  onChange={(event, newValue) => {
                    setForm((prev) => ({
                      ...prev,
                      stars: newValue,
                    }));
                  }}
                  defaultValue={5}
                  size="large"
                />
              </div>

              <RadioText>
                발표 내용 관련 추가 설명 / 미팅이 필요하신가요?{" "}
              </RadioText>
              <RadioContainer>
                <Radio
                  onChange={onRadioChange}
                  id="Y"
                  checked={form.is_help_needed === "Y" ? true : false}
                  name="is_help_needed"
                  label="Yes"
                />
                <Radio
                  onChange={onRadioChange}
                  id="N"
                  checked={form.is_help_needed === "N" ? true : false}
                  name="is_help_needed"
                  label="No"
                />
              </RadioContainer>
              <div
                style={{
                  padding: "1rem 10rem 2rem",
                }}
                className="btn-event"
              >
                <div
                  style={{
                    position: "static",
                    marginBottom: "1.2rem",
                    padding: "0",
                  }}
                  className="error"
                >
                  {msg && msg}
                </div>
                <button type="button" onClick={onSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

StarRatingModal.propTypes = {};

export default StarRatingModal;
