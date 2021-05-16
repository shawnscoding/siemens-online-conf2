import React, { useState } from "react";
import { apiClient } from "../../utils/data/api";

const FindUserId = ({ toggleForm }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
  });

  const [userId, setUserId] = useState("");
  const [isSucceeded, setIsSucceeded] = useState(false);

  const handleGoBack = () => {
    toggleForm("login");
  };

  const handleRoute = (path) => {
    toggleForm(path);
    setIsSucceeded(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const regex = /^[0-9\b -]{0,13}$/;
      if (regex.test(value)) {
        setForm({
          ...form,
          [name]: value,
        });
      }
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const [msg, setMsg] = useState({
    id: null,
    msg: null,
  });

  const handleFindID = async () => {
    const { name, phone } = form;

    if (!name.length) {
      setMsg({
        id: "400",
        msg: "성함을 입력해주세요",
      });
    } else if (!phone.length) {
      setMsg({
        id: "400",
        msg: "핸드폰 번호를 입력해주세요",
      });
    } else {
      setMsg({ id: "", msg: "" });

      try {
        const { data } = await apiClient.post("/auth/findUserId", {
          name,
          phone,
        });

        if (data.messageId) {
          setUserId(data.email);
          setIsSucceeded(true);
        }
      } catch (err) {
        console.log("err", err.response);
        const { error, code } = err.response.data;

        setMsg({
          id: code,
          msg: error,
        });
      }
    }
  };

  return (
    <>
      {!isSucceeded ? (
        <div className="popup">
          <div className="pop-tb pw-reset">
            <div className="pop-cell zoomIn">
              <div className="login-box">
                <div className="pw-header loginbox__header line2">
                  <button type="button" onClick={handleGoBack} className="prev">
                    prev
                  </button>
                  <h2>ID Assistance</h2>
                </div>
                <div className="pop-content">
                  <div className="form-inbox">
                    <ul>
                      <li className="reset-pw">
                        <p className="txt">
                          등록하신 성함과 핸드폰 번호를 입력해주세요.
                        </p>
                      </li>
                      <li>
                        <label htmlFor="name">
                          <span>name</span>
                          <input
                            id="name"
                            type="text"
                            title="name"
                            name="name"
                            onChange={handleChange}
                            value={form.name}
                            placeholder="성함 입력"
                          />
                        </label>
                      </li>
                      <li>
                        <label htmlFor="phone">
                          <span>phone</span>
                          <input
                            name="phone"
                            id="phone"
                            value={form.phone}
                            onChange={handleChange}
                            type="text"
                            title="tel"
                            className="input_tel"
                            placeholder="핸드폰 번호 입력 (하이픈 없이 입력)"
                          />
                        </label>
                      </li>
                    </ul>
                  </div>

                  <div className="btn-login">
                    {msg.msg && <div className="error">{msg.msg}</div>}

                    <button type="button" onClick={handleFindID}>
                      Find ID
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="popup">
          <div className="pop-tb pw-reset">
            <div className="pop-cell zoomIn">
              <div className="login-box">
                <div className="pw-header loginbox__header line2">
                  <h2>ID Assistance</h2>
                </div>
                <div className="pop-content">
                  <div
                    style={{
                      padding: "4rem 6rem 1rem",
                    }}
                    className="form-inbox"
                  >
                    <ul>
                      <li className="reset-pw">
                        <p className="txt">
                          입력하신 정보로 등록된 ID는 {userId} 입니다.
                        </p>
                      </li>
                    </ul>
                  </div>

                  <div className="btn-login" style={{ display: "flex" }}>
                    <button
                      type="button"
                      style={{ padding: "1.5rem 3rem", marginRight: "40px" }}
                      onClick={() => handleRoute("findPW")}
                    >
                      Find PW
                    </button>
                    <button
                      type="button"
                      style={{ padding: "1.5rem 3rem" }}
                      onClick={() => handleRoute("login")}
                    >
                      Log in
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FindUserId;
