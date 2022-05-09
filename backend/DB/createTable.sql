DROP TABLE IF EXISTS Todos 

CREATE TABLE Todos(
    id VARCHAR(200) NOT NULL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    due_date DATE NOT NULL,
    assigned_to VARCHAR(50),
    completed_at DATE,
    status VARCHAR(20) NOT NULL  DEFAULT 'incomplete',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

