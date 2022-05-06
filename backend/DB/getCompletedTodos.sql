CREATE or ALTER PROCEDURE getCompletedTodos 
AS
BEGIN

SELECT id, title, description, FORMAT(due_date, 'dd/MM/yyyy') as due_date, FORMAT(completed_at, 'dd/MM/yyyy') as completed_at, status, created_at, DATEDIFF(hour, completed_at, due_date) as hourDifference FROM Todos
WHERE status = 'complete'
ORDER BY created_at

END