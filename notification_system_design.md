

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
# Stage 3(detailed content)

## Query Analysis

```sql
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt ASC;
```



## Is This Query Correct?

Yes, the query is logically correct because it fetches unread notifications for a specific student and sorts them by creation time.

However, the query becomes slow when the database grows to millions of records.



## Why Is The Query Slow?

The database contains:
- 50,000 students
- 5,000,000 notifications

Without proper indexing, the database performs a full table scan to find matching rows.

Sorting using `ORDER BY createdAt` also increases computation cost.



## Problems With Current Query

- Full table scan
- High disk I/O
- Slow sorting operation
- Increased query execution time as data grows



## Recommended Solution

Use a composite index:

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt);
```



## Why Composite Index?

This index helps because:
- `studentID` filters records
- `isRead` filters unread notifications
- `createdAt` supports sorting

This avoids full table scanning and improves performance significantly.



## Should We Add Indexes On Every Column?

No.

Adding indexes on every column is not effective because:
- Increases storage usage
- Slows INSERT and UPDATE operations
- Creates unnecessary overhead
- Some indexes may never be used

Indexes should only be created for frequently queried columns.



## Query To Find Students Who Received Placement Notifications

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL 7 DAY;
```



## Recommended Additional Index

```sql
CREATE INDEX idx_notification_type_created
ON notifications(notificationType, createdAt);
```

This improves filtering for notification type and date range queries.



## Expected Improvement

With proper indexing:
- Faster filtering
- Faster sorting
- Reduced query execution time
- Better scalability for millions of records



## Final Recommendation

Use composite indexes based on query patterns instead of indexing every column. Proper indexing greatly improves performance and reduces database load in large-scale notification systems.

# Stage 4

## Performance Improvements

As the number of notifications increases, fetching all notifications on every page load becomes inefficient and increases database load. The following optimizations can improve performance.



## 1. Pagination

Instead of loading all notifications at once, the API should return limited results per request.

Example:

GET /notifications?page=1&limit=10

Benefits:
- Reduces database load
- Faster API response
- Lower memory usage
- Better user experience



## 2. Caching

Frequently accessed notifications can be stored in cache memory using Redis.

Benefits:
- Faster repeated requests
- Reduced database queries
- Improved scalability

Cache can be refreshed periodically or invalidated when new notifications are added.



## 3. Lazy Loading

Notifications should load only when required by the user.

Example:
- Load first 10 notifications initially
- Load more when scrolling

Benefits:
- Faster initial page rendering
- Reduced bandwidth usage
- Better frontend performance



## 4. Background Fetch

Notifications can be fetched periodically in the background instead of requesting them repeatedly on every page refresh.

Example:
- Polling every 30 seconds
- WebSockets for real-time updates

Benefits:
- Reduced API traffic
- Near real-time updates
- Improved user experience



## Tradeoffs

| Strategy | Advantages | Disadvantages |
|----------|-------------|---------------|
| Pagination | Reduces load | Extra API calls |
| Caching | Faster responses | Cache invalidation complexity |
| Lazy Loading | Better frontend speed | More frontend logic |
| Background Fetch | Real-time feel | Increased implementation complexity |



## Recommended Solution

Use a combination of:
- Pagination
- Redis caching
- Lazy loading
- Background polling/WebSockets

This provides scalable and efficient notification delivery for large numbers of users.


# Stage 5

## Reliable Notification System

The current implementation sends notifications synchronously, which creates performance and reliability issues when sending notifications to a large number of users.

To improve scalability and reliability, the system should use queue-based asynchronous processing.



## Problems in Existing Implementation

- Email sending is slow
- One failure can interrupt the entire process
- High response time
- Poor scalability
- Difficult to retry failed notifications



## Improved Architecture

The notification system should follow this flow:

1. Save notification to database
2. Push notification job into queue
3. Background worker processes queue
4. Worker sends email/push notification
5. Retry failed jobs automatically



## Queue System

A message queue like RabbitMQ, Kafka, or BullMQ can be used.

Benefits:
- Handles large traffic efficiently
- Prevents server overload
- Improves reliability
- Decouples notification processing from API requests



## Retry Mechanism

If notification delivery fails:
- Retry automatically after delay
- Maintain retry count
- Move permanently failed jobs to dead-letter queue

Benefits:
- Prevents notification loss
- Handles temporary failures
- Improves delivery success rate



## Background Workers

Dedicated worker processes consume jobs from the queue and send notifications independently.

Benefits:
- Faster API response
- Parallel processing
- Better scalability



## Async Processing

Notification sending should happen asynchronously instead of blocking the API request.

Benefits:
- Non-blocking operations
- Better user experience
- Reduced request latency



## Improved Pseudocode

python
function create_notification(student_ids, message):

    notification_id = save_to_database(message)

    for student_id in student_ids:

        push_to_queue({
            student_id,
            notification_id,
            retry_count: 0
        })

    return success


worker_process():

    while queue is not empty:

        job = get_next_job()

        try:

            send_email(job.student_id)

            mark_as_sent(job.notification_id)

        except Exception:

            if job.retry_count < 3:

                job.retry_count += 1

                requeue_job(job)

            else:

                move_to_dead_letter_queue(job)