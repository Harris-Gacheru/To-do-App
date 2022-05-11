CREATE or ALTER PROCEDURE createTodo @id varchar(200), @title varchar(50), @description varchar(255), @due_date date, @assigned_to varchar(50)
AS 
BEGIN

INSERT INTO Todos(id, title, description, due_date, assigned_to) 
VALUES(@id, @title, @description, @due_date, @assigned_to)

END