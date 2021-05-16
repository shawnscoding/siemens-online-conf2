/*
project root의 .env 환경변수 참고.
*/

const CDN_HOST = `${process.env.REACT_APP_CDN_HOST}`;
const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}`;

const define = {
  CDN_HOST: `${process.env.REACT_APP_CDN_HOST}`,
  API_BASE_URL: `${process.env.REACT_APP_API_BASE_URL}`,
  WEBSOCKET_SERVER: `${process.env.REACT_APP_WEBSOCKET_SERVER}`,
  RESOURCE: {
    INTRO_BACKGROUND: `${CDN_HOST}/assets/lobby/lobby_bg.png`,
    LOBBY_BACKGROUND: `${CDN_HOST}/assets/lobby/lobby_bg.png`,
    EXHIBITION_BACKGROUND_1: `${CDN_HOST}/assets/exhibition/exhibition_bg_1.jpg`,
    EXHIBITION_BACKGROUND_2: `${CDN_HOST}/assets/exhibition/exhibition_bg_2.jpg`,
    BOOTH_BACKGROUND: `${CDN_HOST}/assets/booth/booth_bg.jpg`,
    MAIN_CONFERENCE_BG: `${CDN_HOST}/assets/mainConference/main_conference_bg.png`,
    MAIN_COVER_DEFAULT: `${CDN_HOST}/assets/mainConference/main_1027_all_day.png`,
    SUB_CONFERENCE_BG: `${CDN_HOST}/assets/subConference/sub_conference_bg.jpg`,
    SUB_COVER_DEFAULT: `${CDN_HOST}/assets/subConference/sub_1027_all_day`,
    ICON_HOME: `${CDN_HOST}/assets/menu_icon/icon_home.png`,
    ICON_AUDITORIUM: `${CDN_HOST}/assets/menu_icon/icon_auditorium.png`,
    ICON_SESSION: `${CDN_HOST}/assets/menu_icon/icon_session.png`,
    ICON_PROGRAMME: `${CDN_HOST}/assets/menu_icon/icon_programme.png`,
    ICON_HELP: `${CDN_HOST}/assets/menu_icon/icon_help.png`,
    ICON_QUESTION: `${CDN_HOST}/assets/icon_help_r.png`,
    ICON_DOWNLOAD: `${CDN_HOST}/assets/icon_download.png`,
    ICON_NETWORKLOUNGE: `${CDN_HOST}/assets/menu_icon/menu_lounge.png`,
    ICON_STAMP: `${CDN_HOST}/assets/menu_icon/menu_event.png`,
    ICON_SURVEY: `${CDN_HOST}/assets/menu_icon/menu_support.png`,
    STATUS_AVAIL: `${CDN_HOST}/assets/booth/status_avail.jpg`,
    STATUS_AWAY: `${CDN_HOST}/assets/booth/status_away.jpg`,
    STATUS_BUSY: `${CDN_HOST}/assets/booth/status_busy.jpg`,
    EVENT_DESCRIPTION: `${CDN_HOST}/resources/cover/event.jpg`,
  },
  API: {
    AUTH_LOGIN: {
      method: "post",
      url: `${API_BASE_URL}/auth/login`,
    },
  },
};

module.exports = define;
