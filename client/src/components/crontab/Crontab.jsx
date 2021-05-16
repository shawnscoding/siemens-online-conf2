import React from "react";
import Crontab from "reactjs-crontab";
import "reactjs-crontab/dist/index.css";
import { apiClient } from "../../utils/data/api";
import NotificationPopup from "../common/notification/NotificationPopup";

const CrontabComponent = React.memo(() => {
  const [notification, setNotification] = React.useState({
    btns: [],
    content: null,
    header: null,
    open: false,
  });

  const [tasks, setTasks] = React.useState();
  // console.log("[ CrontabComponent ] rendered");
  React.useEffect(() => {
    const fn = async () => {
      try {
        const res = await apiClient.get("/notification");
        // console.log("data ", res.data);

        // const _tasks = res.data.map((item) => ({
        //   fn: () => {
        //     setNotification((prev) => ({
        //       ...prev,
        //       open: true,
        //       content: item.contents,
        //     }));
        //   },
        //   id: item.idx.toString(),
        //   config: item.pushtime_in_cron_format,
        // }));

        const arr = [];
        for (const item of res.data) {
          if (item.notify_condition !== "test") {
            arr.push({
              fn: () => {
                setNotification((prev) => ({
                  ...prev,
                  open: true,
                  content: item.contents,
                }));
              },
              id: item.idx.toString(),
              config: item.pushtime_in_cron_format,
            });
          }
        }
        // console.log("res ::", res.data);
        // console.log("arr ::", arr);
        setTasks(arr);
      } catch (err) {
        console.log("err :: ", err);
      }
    };
    fn();
  }, []);

  // tasks should be memoized
  const onClose = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <div
      style={{
        background: "white",
      }}
    >
      {tasks && (
        <Crontab
          tasks={tasks}
          timeZone="Asia/Seoul"
          // timezone is PC local timezone.
          dashboard={{
            hidden: true,
            // if true, dashboard is hidden
          }}
        />
      )}
      {/* timeZone 값 범위에 Asia/Seoul 은 없어서 error 발생함. 사용법 다시 확인해주세요. */}
      {notification.open && (
        <NotificationPopup notification={notification} onClose={onClose} />
      )}
    </div>
  );
});

export default CrontabComponent;
