import React from "react";
import { isEmpty } from "../../../utils/helper";
import { CDN_HOST } from "../../../config/define";
import styled from "styled-components";

const BioContainer = styled.dl`
  width: 55% !important;

  @media screen and (max-width: 500px) {
    width: 100% !important;
  }
`;

const Dd = styled.dd`
  word-break: break-word;
`;

const SpeakerPage = ({ profile }) => {
  if (!profile) return <></>;
  const renderProfile = () => {
    const { profile_ko, profile_en } = profile;
    const profiles = [];
    if (profile_ko) {
      profiles.push(
        profile_ko.split("\n").map((line, index) => {
          return (
            <li key={index + 1} className="his_item">
              {line}
            </li>
          );
        })
      );
    }
    if (profile_en) {
      profiles.push(<br />);
      profiles.push(
        profile_en.split("\n").map((line, index) => {
          return (
            <li key={index + 1} className="his_item">
              {line}
            </li>
          );
        })
      );
    }
    return profiles;
  };

  const {
    name_en,
    name_ko,
    title_en,
    title_ko,
    affiliation_ko,
    affiliation_en,
  } = profile;

  let name = "";
  let title = "";
  let affiliation = "";
  if (!isEmpty(name_ko)) name = name_ko;
  else if (!isEmpty(name_en)) name = name_en;

  if (!isEmpty(title_en)) title = title_en;
  else if (!isEmpty(title_ko)) title = title_ko;

  if (!isEmpty(affiliation_ko)) affiliation = affiliation_ko;
  else if (!isEmpty(affiliation_en)) affiliation = affiliation_en;

  return (
    <div className="profile_wrap">
      <div
        className="profile_item pic"
        style={{
          backgroundImage: `url(${CDN_HOST}${profile.photo_url})`,
        }}
      />
      <BioContainer className="profile_item">
        <dt>이름</dt>
        <Dd>{name}</Dd>

        <dt>직함 / 부서</dt>
        <Dd>{title}</Dd>

        <dt>회사명</dt>
        <Dd>{`${affiliation}`}</Dd>
      </BioContainer>

      <dl className="profile_item his">
        <dt>발표내용 요약</dt>
        <Dd>
          <ul className="his_wrap">{renderProfile()}</ul>
        </Dd>
      </dl>
    </div>
  );
};

export default SpeakerPage;
