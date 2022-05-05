CREATE or ALTER PROCEDURE getCompletedTodos 
AS
BEGIN

SELECT id, title, description, FORMAT(due_date, 'dd/MM/yyyy') as due_date, completed_at, status, created_at FROM Todos
WHERE status = 'complete'
ORDER BY created_at

END