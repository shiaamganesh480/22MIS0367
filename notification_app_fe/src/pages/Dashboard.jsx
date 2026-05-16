import { useEffect, useState } from "react";

import API from "../services/api";

import Log from "../utils/logger";

function Dashboard() {

  const [notifications, setNotifications] = useState([]);

  const [filter, setFilter] = useState("");

  useEffect(() => {

    loadDashboard();

  }, []);

  const loadDashboard = async () => {

    await Log(
      "frontend",
      "info",
      "component",
      "Dashboard rendered"
    );

    fetchNotifications();

  };

  const fetchNotifications = async () => {

    try {

      const response = await API.get("/notifications");

      setNotifications(response.data.notifications);

    } catch (error) {

      console.log(error);

    }
  };

  const filteredNotifications = filter
    ? notifications.filter(
        (item) => item.Type === filter
      )
    : notifications;

  return (

    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "auto",
        fontFamily: "Arial"
      }}
    >

      <h1
        style={{
          textAlign: "center"
        }}
      >
        Priority Notifications
      </h1>

      <div
        style={{
          marginBottom: "20px",
          textAlign: "center"
        }}
      >

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
          style={{
            padding: "10px",
            width: "200px"
          }}
        >

          <option value="">
            All Notifications
          </option>

          <option value="Placement">
            Placement
          </option>

          <option value="Result">
            Result
          </option>

          <option value="Event">
            Event
          </option>

        </select>

      </div>

      {
        filteredNotifications.length === 0 ? (

          <h2
            style={{
              textAlign: "center"
            }}
          >
            No Notifications Found
          </h2>

        ) : (

          filteredNotifications.map((item) => (

            <div
              key={item.ID}
              style={{
                border: "1px solid gray",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "10px"
              }}
            >

              <h2>{item.Type}</h2>

              <p>{item.Message}</p>

              <p>{item.Timestamp}</p>

              <p>
                Status: {
                  item.read
                    ? "Read"
                    : "Unread"
                }
              </p>

            </div>

          ))

        )
      }

    </div>
  );
}

export default Dashboard;