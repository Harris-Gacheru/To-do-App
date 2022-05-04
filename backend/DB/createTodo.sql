CREATE or ALTER PROCEDURE createTodo @id varchar(200), @title varchar(50), @description varchar(255), @due_date date
AS 
BEGIN

INSERT INTO Todos(id, title, description, due_date) 
VALUES(@id, @title, @description, @due_date)

END