const axios = require("axios");

const Log = require("../middleware/logger");

const getNotifications = async (req, res) => {

  try {

    await Log(
      "backend",
      "info",
      "controller",
      "Fetching notifications"
    );

    const response = await axios.get(
      process.env.NOTIFICATION_API,
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      }
    );

    const notifications = response.data.notifications;

    const priorityMap = {
      Placement: 3,
      Result: 2,
      Event: 1
    };

    notifications.sort((a, b) => {

      const priorityDifference =
        priorityMap[b.Type] - priorityMap[a.Type];

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      return new Date(b.Timestamp) - new Date(a.Timestamp);

    });

    const topNotifications = notifications.slice(0, 10);

    res.json({
      success: true,
      notifications: topNotifications
    });

  } catch (error) {

    await Log(
      "backend",
      "error",
      "controller",
      "Failed to fetch notifications"
    );

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

module.exports = {
  getNotifications
};