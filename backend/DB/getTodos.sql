CREATE or ALTER PROCEDURE getTodos 
AS
BEGIN

SELECT id, title, description, FORMAT(due_date, 'dd/MM/yyyy') as due_date, created_at FROM Todos
ORDER BY created_at

END