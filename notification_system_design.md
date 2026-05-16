

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

# Stage 4

## Performance Improvements

As the number of notifications increases, fetching all notifications on every page load becomes inefficient and increases database load. The following optimizations can improve performance.

---

## 1. Pagination

Instead of loading all notifications at once, the API should return limited results per request.

Example:

GET /notifications?page=1&limit=10

Benefits:
- Reduces database load
- Faster API response
- Lower memory usage
- Better user experience

---

## 2. Caching

Frequently accessed notifications can be stored in cache memory using Redis.

Benefits:
- Faster repeated requests
- Reduced database queries
- Improved scalability

Cache can be refreshed periodically or invalidated when new notifications are added.

---

## 3. Lazy Loading

Notifications should load only when required by the user.

Example:
- Load first 10 notifications initially
- Load more when scrolling

Benefits:
- Faster initial page rendering
- Reduced bandwidth usage
- Better frontend performance

---

## 4. Background Fetch

Notifications can be fetched periodically in the background instead of requesting them repeatedly on every page refresh.

Example:
- Polling every 30 seconds
- WebSockets for real-time updates

Benefits:
- Reduced API traffic
- Near real-time updates
- Improved user experience

---

## Tradeoffs

| Strategy | Advantages | Disadvantages |
|----------|-------------|---------------|
| Pagination | Reduces load | Extra API calls |
| Caching | Faster responses | Cache invalidation complexity |
| Lazy Loading | Better frontend speed | More frontend logic |
| Background Fetch | Real-time feel | Increased implementation complexity |

---

## Recommended Solution

Use a combination of:
- Pagination
- Redis caching
- Lazy loading
- Background polling/WebSockets

This provides scalable and efficient notification delivery for large numbers of users.