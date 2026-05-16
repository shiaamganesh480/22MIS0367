

GET /notifications

Response:
{
  "notifications": []
}



POST /notifications

Request:
{
  "title": "Placement Alert",
  "message": "TCS hiring"
}

Response:
{
  "successs": true
}



# Stage 2



{
  "_id": "",
  "studentId": "",
  "type": "",
  "message": "",
  "timestamp": ""
}



- Use indexing
- Use pagination
- Use sharding

# Stage 3
The query is slow because it scans many rows.

Suggested Index:
(studentId, isRead, createdAt)

Avoid indexing every column.