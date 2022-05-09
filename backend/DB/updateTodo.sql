CREATE OR ALTER PROCEDURE updateTodo @id varchar(200), @title varchar(50), @description varchar(255), @due_date date, @assigned_to varchar(50)
AS
BEGIN

UPDATE Todos 
SET title = @title, description = @description, due_date = @due_date, assigned_to = @assigned_to
WHERE id = @id

END