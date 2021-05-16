let isLoginMessageSent = false;

export const checkCurrentTime = (notifications) => {
  const date = new Date();
  const currentTime = date.toISOString();
  const slicedCurrentTime = currentTime.slice(0, currentTime.length - 8);
  const currentDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  // console.log("타이머 시작 시간 : ", slicedCurrentTime);
  // console.log("타이머 날짜 : ", currentDate);

  const indexes = notifications
    .filter((time) => {
      if (time.notify_condition === "login" && !isLoginMessageSent) {
        return time.notify_datetime.indexOf(currentDate) > -1
          ? ((isLoginMessageSent = true), notifications)
          : null;
      }
      return time.notify_datetime.indexOf(slicedCurrentTime) > -1
        ? time.idx
        : null;
    })
    .map((v) => v.idx);

  return indexes.length ? indexes : [];
};

// export default currentTime;
