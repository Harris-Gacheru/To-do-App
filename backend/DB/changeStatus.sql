CREATE OR ALTER PROCEDURE changeStatus @id VARCHAR(200)
AS
BEGIN

UPDATE Todos
SET status = 'complete', completed_at = CURRENT_TIMESTAMP
WHERE id = @id

END