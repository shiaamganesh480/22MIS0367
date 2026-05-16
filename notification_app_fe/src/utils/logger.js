import axios from "axios";

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzaGlhYW1nYW5lc2guYXMyMDIyQHZpdHN0dWRlbnQuYWMuaW4iLCJleHAiOjE3Nzg5MzE5MTAsImlhdCI6MTc3ODkzMTAxMCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImM3MDAwMjVjLTU2ZjYtNGVlMi05Y2EzLWYzOGNlODBlZGM5NyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InNoaWFhbWdhbmVzaCIsInN1YiI6IjY4MmYxYTFiLTQ3ZjgtNDgzMC1hMjA4LTJiNTU2NjJiNDVhMiJ9LCJlbWFpbCI6InNoaWFhbWdhbmVzaC5hczIwMjJAdml0c3R1ZGVudC5hYy5pbiIsIm5hbWUiOiJzaGlhYW1nYW5lc2giLCJyb2xsTm8iOiIyMm1pczAzNjciLCJhY2Nlc3NDb2RlIjoiU2ZGdVdnIiwiY2xpZW50SUQiOiI2ODJmMWExYi00N2Y4LTQ4MzAtYTIwOC0yYjU1NjYyYjQ1YTIiLCJjbGllbnRTZWNyZXQiOiJ6enZQWUFad3FIampESmJDIn0.-xRi5w3feNIou3dwSJAl4z-99bvlA9kV_sdqt20AvOM";

const Log = async (
  stack,
  level,
  packageName,
  message
) => {

  try {

    await axios.post(
      "http://4.224.186.213/evaluation-service/logs",
      {
        stack,
        level,
        package: packageName,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`
        }
      }
    );

  } catch (error) {

    console.log(error.message);

  }
};

export default Log;