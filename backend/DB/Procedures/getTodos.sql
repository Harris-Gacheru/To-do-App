CREATE or ALTER PROCEDURE getTodos 
AS
BEGIN

SELECT id, title, description, FORMAT(due_date, 'dd/MM/yyyy') as due_date, assigned_to, completed_at, status, created_at FROM Todos
WHERE status = 'incomplete'
ORDER BY created_at

END