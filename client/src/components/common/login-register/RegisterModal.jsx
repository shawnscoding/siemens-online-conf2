import React from "react";
import styled from "styled-components";
import { apiClient } from "../../../utils/data/api";
import { isEmpty } from "../../../utils/helper";
import CloseIcon from "@material-ui/icons/Close";
import { AuthContext } from "../../../store/auth/AuthContext";
const LoginCloseBtn = styled.button`
  position: absolute;
  z-index: 10;
  right: 8px;
  top: 12px;
  color: inherit;
  cursor: pointer;
`;

const StyledCloseIcon = styled(CloseIcon)`
  width: 49px !important;
  height: 49px !important;
  color: #d4d4d4;
`;

const requiredTextFields = {
  email: "Email을 입력해주세요",
  password: "비밀번호를 입력해주세요",
  password_confirm: "비밀번호 확인을 입력해주세요",
  name: "이름을 입력해주세요",
  title: "직함을 입력해주세요",
  affiliation: "회사명을 입력해주세요",
  mobile_no: "휴대폰번호를 입력해주세요",
};

const requiredRadios = {
  is_agreed_privacy_policy_1: "개인정보 공개 1에 동의해주세요",
  is_agreed_privacy_policy_2: "개인정보 공개 2에 동의해주세요",
  is_agreed_network_policy: "네트워킹 라운지 개인정보 공개에 동의해주세요",
  is_agreed_promotion: "마케팅 및 광고 활용에 동의 혹은 비동의 해주세요",
};

const Register = ({ onPrev, onCloseModal }) => {
  const [loading, setLoading] = React.useState({ open: false });
  const [msg, setMsg] = React.useState({ msg: "", code: null });
  const [success, setSuccess] = React.useState(false);
  const [form, setForm] = React.useState({
    email: "",
    password: "",
    password_confirm: "",
    name: "",
    title: "",
    affiliation: "",
    department: "",
    mobile_no: "",
    is_agreed_privacy_policy_1: "",
    is_agreed_privacy_policy_2: "",
    is_agreed_network_policy: "",
    is_agreed_promotion: "",
  });

  const onChange = (e) => {
    let { id, value } = e.target;
    if (id === "mobile_no") {
      value = value.replace(/[^0-9]+/g, "");
    }
    setForm({
      ...form,
      [id]: value,
    });
  };

  const onRadioChange = (e) => {
    const { name, id } = e.target;
    console.log("naem id ", name, id);

    setForm((prev) => ({
      ...prev,
      [name]: id.slice(0, 1),
    }));
  };

  const { referencedBy } = React.useContext(AuthContext);

  const onSubmit = async (e) => {
    e.preventDefault();
    for (const key in requiredTextFields) {
      // empty check
      if (isEmpty(form[key]) || form[key] === "") {
        setMsg({ msg: requiredTextFields[key] });
        return;
      }
    }
    for (const key in requiredRadios) {
      if (isEmpty(form[key]) || form[key] === "") {
        // empty check
        setMsg({ msg: requiredRadios[key] });
        return;
      }
      // console.log(key, form[key]);
      if (key !== "is_agreed_promotion" && form[key] === "N") {
        // N check (is_agreed_promotion 제외)
        setMsg({ msg: requiredRadios[key] });
        return;
      }
    }
    const body = { ...form };
    delete body.is_agreed_privacy_policy_1;
    delete body.is_agreed_privacy_policy_2;
    body.is_agreed_privacy_policy = "Y";
    body.referencedBy = referencedBy;

    console.log("body ::", body);
    setLoading({ loading: true });
    try {
      // console.log("form ::", form);i
      const res = await apiClient.post("/register", body);
      console.log("data ::", res);
      // window.alert("You have registered successfully");
      setLoading({ loading: false });
      setMsg({ msg: "성공적으로 등록되었습니다. 로그인해주세요." });
      setSuccess(true);
    } catch (err) {
      console.log("err", err);
      const { error, code } = err.response.data;
      setLoading({ loading: false });
      setMsg({ msg: error, code });
    }
  };

  const {
    name,
    affiliation,
    title,
    email,
    password,
    password_confirm,
    is_agreed_privacy_policy_1,
    is_agreed_privacy_policy_2,
    is_agreed_network_policy,
    is_agreed_promotion,
    mobile_no,
    department,
  } = form;
  return (
    <>
      <div className="popup">
        <div className="pop-tb">
          <div className="pop-cell zoomIn">
            <div
              style={{
                position: "relative",
              }}
              className="login-box"
            >
              <LoginCloseBtn
                type="button"
                className="login__close-btn"
                title="Close"
                onClick={onCloseModal}
              >
                <StyledCloseIcon />
              </LoginCloseBtn>
              <div className="modal-header">
                <button
                  type="button"
                  title="Back"
                  onClick={onPrev}
                  className="prev"
                >
                  prev
                </button>
                <h2>행사등록</h2>
              </div>
              <div className="loginbox__content loginbox__content--event">
                <p className="loginbox__help-msg">
                  향후 입력하신 이메일과 비밀번호로
                  <br />
                  간단하게 컨퍼런스에 참가하실 수 있습니다.
                </p>
                <form onSubmit={onSubmit} className="form">
                  <div className="form__item">
                    <label htmlFor="email">
                      <span className="form__span">이메일</span>
                      <input
                        className="form__input"
                        type="email"
                        title="email"
                        id="email"
                        value={email}
                        onChange={onChange}
                      />
                    </label>
                  </div>
                  <div className="form__item">
                    <label htmlFor="password">
                      <span className="form__span">비밀번호</span>
                      <input
                        className="form__input"
                        type="password"
                        title="password"
                        value={password}
                        onChange={onChange}
                        id="password"
                      />
                    </label>
                  </div>
                  <div className="form__item">
                    <label htmlFor="">
                      <span htmlFor="password" className="form__span">
                        비밀번호 확인
                      </span>
                      <input
                        className="form__input"
                        type="password"
                        title="password confirm"
                        value={password_confirm}
                        onChange={onChange}
                        id="password_confirm"
                      />
                    </label>
                  </div>
                  <div className="form__item">
                    <label htmlFor="name">
                      <span className="form__span">이름</span>
                      <input
                        className="form__input"
                        type="text"
                        title="name"
                        value={name}
                        onChange={onChange}
                        id="name"
                      />
                    </label>
                  </div>
                  <div className="form__item">
                    <label htmlFor="">
                      <span className="form__span">직함</span>
                      <input
                        className="form__input"
                        type="text"
                        title="job title"
                        value={title}
                        onChange={onChange}
                        id="title"
                      />
                    </label>
                  </div>
                  <div className="form__item">
                    <label htmlFor="affiliation">
                      <span className="form__span">회사명</span>
                      <input
                        className="form__input"
                        type="text"
                        title="company"
                        value={affiliation}
                        onChange={onChange}
                        id="affiliation"
                      />
                    </label>
                  </div>
                  <div className="form__item">
                    <label htmlFor="affiliation">
                      <span className="form__span">부서</span>
                      <input
                        className="form__input"
                        type="text"
                        title="department"
                        value={department}
                        onChange={onChange}
                        id="department"
                      />
                    </label>
                  </div>
                  <div className="form__item">
                    <label htmlFor="mobile_no">
                      <span className="form__span">
                        휴대폰번호 ('-' 제외 01000000000)
                      </span>

                      <input
                        type="tel"
                        pattern="\d*"
                        className="form__input"
                        title="Mobile"
                        value={mobile_no}
                        onChange={onChange}
                        id="mobile_no"
                      />
                    </label>
                  </div>
                  <div className="policy">
                    <div className="policy__border">
                      <p className="policy__title">
                        1. 개인정보수집 및 이용 동의서
                      </p>
                    </div>
                    <div className="policy__txt">
                      지멘스 디지털 인더스트리 소프트웨어 주식회사(이하
                      지멘스)는 ‘2021 지멘스 전기차/자율주행차 기술 온라인
                      컨퍼런스’ 사전등록 참가자(이하 참가자)의 소중한 개인정보를
                      보호하기 위하여 “개인정보보호법” 등 개인정보에 관한 제반
                      법령을 준수하고 있습니다. 지멘스는 “개인정보처리방침＂을
                      제정하여 참가자가 제공하는 개인정보가 어떠한 용도와
                      방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한
                      조치가 취해지고 있는지 알려드립니다.
                      <br />
                      <br />
                      1. 개인정보 수집 · 이용에 대한 동의
                      <br />
                      <br />
                      1) 수집 방법
                      <br />
                      2021 지멘스 전기차/자율주행차 기술 온라인 컨퍼런스 공식
                      홈페이지 사전등록 2021 지멘스 전기차/자율주행차 기술
                      온라인 컨퍼런스 플랫폼 내 로그인 및 마이페이지
                      <br />
                      2) 수집하는 개인정보의 이용 목적
                      <br />
                      2021 지멘스 전기차/자율주행차 기술 온라인 컨퍼런스
                      사전등록 접수 및 참석여부 확인, 스탬프 투어 경품 제공,
                      행사 정보 안내, 문의 응대 상기 기재하신 귀하의 개인정보는
                      본 행사 참가지원 및 향후 신규 행사 홍보 마케팅 관련 정보
                      제공 목적으로 에이전시(화인플레이스)에 의해 수집 &
                      이용되고, 관련 개인 정보는 이용 목적을 달성 후 지체없이
                      파기됩니다.
                      <br />
                      3) 수집 항목
                      <br />
                      필수 : 개인 정보(이름, 소속, 이메일, 휴대폰 번호 등)
                      ※인터넷 서비스 이용과정에서 아래 개인정보 항목이 자동으로
                      생성되어 수집될 수 있습니다. (IP 주소, 쿠키, MAC 주소,
                      서비스 이용 기록, 방문 기록 등)
                      <br />
                      4) 보유 및 이용기간
                      <br />
                      ① 지멘스 디지털 인더스트리 소프트웨어는 정보주체에게 동의
                      받은 개인정보 보유기간이 경과하거나 개인정보의 처리 목적이
                      달성된 경우 지체 없이 개인정보를 복구·재생할 수 없도록
                      파기합니다.
                      <br />
                      다만, 다른 법률에 따라 개인정보를 보존하여야 하는 경우에는
                      해당 기간 동안 개인정보를 보존합니다.
                      <br />
                      ② 처리목적에 따른 개인정보의 보유기간은 다음과 같습니다.
                      <br />
                      -신청자 정보: 행사 종료 후 6개월 이내 파기
                      <br />
                      ※ 관계 법령
                      <br />
                      이용자의 인터넷 로그 등 로그 기록 / 이용자의 접속자 추적
                      자료 : 6개월 (통신비밀보호법)
                      <br />
                      5) 수집 거부의 권리
                      <br />
                      귀하는 본 개인정보에 대한 수집 및 이용 동의를 거부하실 수
                      있고, 다만, 이에 동의하지 않으실 경우 본 행사 참여 및
                      진행이 제한될 수 있으며 향후 마케팅 관련 정보를 제공
                      받으실 수 없습니다.
                    </div>
                    <div className="ipt-wrap reset policy__radio">
                      <p className="radios2">
                        <label
                          htmlFor="Y_is_agreed_privacy_policy_1"
                          className="radios2"
                        >
                          <input
                            checked={is_agreed_privacy_policy_1 === "Y"}
                            type="radio"
                            id="Y_is_agreed_privacy_policy_1"
                            name="is_agreed_privacy_policy_1"
                            onChange={onRadioChange}
                          />
                          <span className="radio-txt">동의합니다.</span>
                        </label>
                      </p>
                      <p className="radios2">
                        <label
                          htmlFor="N_is_agreed_privacy_policy_1"
                          className="radios2"
                        >
                          <input
                            checked={is_agreed_privacy_policy_1 === "N"}
                            type="radio"
                            id="N_is_agreed_privacy_policy_1"
                            name="is_agreed_privacy_policy_1"
                            onChange={onRadioChange}
                          />
                          <span className="radio-txt">동의하지 않습니다.</span>
                        </label>
                      </p>
                    </div>
                  </div>
                  <div className="policy">
                    <div className="policy__border">
                      <p className="policy__title">
                        2. 개인정보 제3자 정보공개 동의
                      </p>
                    </div>
                    <div className="messge-box policy__txt">
                      1) 제공받는 자<br />
                      2021 지멘스 전기차/자율주행차 기술 온라인 컨퍼런스 플랫폼
                      내 전시 참가 업체
                      <br />
                      <br />
                      2) 제공받는 자의 개인정보 이용 목적
                      <br />
                      2021 지멘스 전기차/자율주행차 기술 온라인 컨퍼런스 전시
                      부스 방문 및 상담 통계, 비즈니스 상담, 설문지, 광고 및
                      마케팅 활용, 행사 진행 및 데이터 베이스 관리
                      <br />
                      동의시 지멘스 관련 소식 이메일이 발송되며, 수신을 원치
                      않는 경우 메일 내 수신 거부 클릭
                      <br />
                      행사 종료 후 행사 등록시 기입한 연락처로 발신 가능
                      <br />
                      <br />
                      3) 제공하는 개인정보의 항목
                      <br />
                      참가자 이름, 소속, 이메일, 연락처, 부스 방문 및 상담 기록
                      <br />
                      <br />
                      4)제공받는 자의 개인정보 보유 및 이용기간
                      <br />
                      2021 지멘스 전기차/자율주행차 기술 온라인 컨퍼런스
                      행사종료 후 6개월
                      <br />
                      <br />
                      5) 개인정보를 제공받는 자
                      <br />
                      주최사 : 지멘스 디지털 인더스트리 소프트웨어
                      <br />
                      전시 참가사 : 캐디언스시스템, 키미이에스, 웍크온
                      시뮬레이션, 씨테크시스템, 스페이스솔루션, 테너지소프트,
                      와이씨디아이에스, 지경솔루텍, 플로우마스터코리아,
                      델타이에스, 브이엠브이테크
                      <br />
                      에이전시 : 화인플레이스
                      <br />
                      <br />
                      <br />
                    </div>
                    <div className="ipt-wrap reset">
                      <p className="radios2">
                        <label
                          htmlFor="Y_is_agreed_privacy_policy_2"
                          className="radios2"
                        >
                          <input
                            checked={is_agreed_privacy_policy_2 === "Y"}
                            onChange={onRadioChange}
                            type="radio"
                            name="is_agreed_privacy_policy_2"
                            id="Y_is_agreed_privacy_policy_2"
                          />
                          <span className="radio-txt">동의합니다.</span>
                        </label>
                      </p>
                      <p className="radios2">
                        <label
                          htmlFor="N_is_agreed_privacy_policy_2"
                          className="radios2"
                        >
                          <input
                            checked={is_agreed_privacy_policy_2 === "N"}
                            onChange={onRadioChange}
                            type="radio"
                            name="is_agreed_privacy_policy_2"
                            id="N_is_agreed_privacy_policy_2"
                          />
                          <span className="radio-txt">동의하지 않습니다.</span>
                        </label>
                      </p>
                    </div>
                  </div>
                  <div className="policy">
                    <div className="policy__border">
                      <p className="policy__title">
                        3. 네트워킹 라운지 개인정보 공개 동의서
                      </p>
                    </div>
                    <div className="messge-box policy__txt">
                      귀하의 개인정보를 2021 지멘스 전기차/자율주행차 기술
                      온라인 컨퍼런스 플랫폼 네트워킹 라운지 내에서 타인이 조회
                      또는 열람하는 것에 동의합니다.
                      <br />
                      <br />
                      ※ 제공되는 개인정보 사항
                      <br />
                      - 이름, 소속, 직함, 연락처, 이메일 등<br />
                      <br />
                      네트워킹 라운지 개인정보 공개에 동의하지 않으실 수
                      있습니다. 다만, 동의 거부 시 네트워킹 라운지 서비스 이용이
                      부분적으로 제한될 수 있습니다(다른 참가자에게 본인 정보를
                      제공하는 기능).
                    </div>
                    <div className="ipt-wrap reset">
                      <p className="radios2">
                        <label
                          htmlFor="Y_is_agreed_network_policy"
                          className="radios2"
                        >
                          <input
                            onChange={onRadioChange}
                            type="radio"
                            name="is_agreed_network_policy"
                            id="Y_is_agreed_network_policy"
                            checked={is_agreed_network_policy === "Y"}
                          />
                          <span className="radio-txt">동의합니다.</span>
                        </label>
                      </p>
                      <p className="radios2">
                        <label
                          htmlFor="N_is_agreed_network_policy"
                          className="radios2"
                        >
                          <input
                            onChange={onRadioChange}
                            type="radio"
                            name="is_agreed_network_policy"
                            id="N_is_agreed_network_policy"
                            checked={is_agreed_network_policy === "N"}
                          />
                          <span className="radio-txt">동의하지 않습니다.</span>
                        </label>
                      </p>
                    </div>
                  </div>
                  <div className="policy">
                    <div className="policy__border">
                      <p className="policy__title">
                        4. 마케팅 및 광고 활용 동의(선택)
                      </p>
                    </div>
                    <div className="messge-box policy__txt">
                      2021 지멘스 전기차/자율주행차 기술 온라인 컨퍼런스
                      플랫폼에서 제공하는 이벤트 및 서비스 안내(행사정보) 등
                      광고성 정보를 받으시려면 마케팅 목적 이용에 동의하여
                      주시기 바랍니다
                      <br />
                      <br />
                      ※ 이용 범위
                      <br />
                      당사 및 제휴사 상품 안내, 이벤트 등 광고성 정보 전달 및
                      참여기회 제공, 회원 대상 각종 마케팅 활동
                    </div>
                    <div className="ipt-wrap reset">
                      <p className="radios2">
                        <label
                          htmlFor="Y_is_agreed_promotion"
                          className="radios2"
                        >
                          <input
                            checked={is_agreed_promotion === "Y"}
                            onChange={onRadioChange}
                            type="radio"
                            name="is_agreed_promotion"
                            id="Y_is_agreed_promotion"
                          />
                          <span className="radio-txt">동의합니다.</span>
                        </label>
                      </p>
                      <p className="radios2">
                        <label
                          htmlFor="N_is_agreed_promotion"
                          className="radios2"
                        >
                          <input
                            checked={is_agreed_promotion === "N"}
                            onChange={onRadioChange}
                            type="radio"
                            name="is_agreed_promotion"
                            id="N_is_agreed_promotion"
                          />
                          <span className="radio-txt">동의하지 않습니다.</span>
                        </label>
                      </p>
                    </div>
                  </div>
                  <div className="btn-confirm">
                    <div className="error">{msg.msg}</div>
                    {success ? (
                      <button type="submit" onClick={onPrev}>
                        로그인
                      </button>
                    ) : (
                      <button type="submit" onClick={onSubmit}>
                        등록하기
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
