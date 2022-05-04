CREATE OR ALTER PROCEDURE updateTodo @id varchar(200), @title varchar(50), @description varchar(255), @due_date date
AS
BEGIN

UPDATE Todos 
SET title = @title, description = @description, due_date = @due_date 
WHERE id = @id

END