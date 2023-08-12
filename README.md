<div>
<img src="https://logos-download.com/wp-content/uploads/2016/09/React_logo_wordmark.png" alt="react" height="60" />&nbsp;
<img src="https://cdn.icon-icons.com/icons2/2699/PNG/512/pocoo_flask_logo_icon_168045.png" alt="nodejs" height="60"/> &nbsp;
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/SQLite370.svg/1200px-SQLite370.svg.png" alt="fireabse" height="60" /> &nbsp;
</div>

# RaceApp

### Description
**ChatApp** is a web application designed to challenge players' reaction times and accuracy. The application leverages the Flask framework on the server side and React on the client side, with socket communication to provide real-time interactivity. Players participate in a game where they must click on a moving target as quickly as possible, testing their reaction speed and aiming skills. 

### Technologies
 - [React](https://react.dev/) with JavaScript for the frontend, including:
    - [React router](https://reactrouter.com/en/main) with v6 for handling the client-side routing,
    - [React redux](https://react-redux.js.org/) for the app-wide state management,
    - [Material UI](https://mui.com/material-ui/getting-started/) for creating the UI.
    - [React Socket.io](https://socket.io/docs/v4/client-api/) for real-time communication with the server.
 - [Flask](https://flask.palletsprojects.com/en/2.3.x/) for the backend, including:
    - [Flask-Smorest](https://flask-smorest.readthedocs.io/en/latest/) used to serialize and deserialize data,
    - [Flask-JWT-Extended](https://flask-jwt-extended.readthedocs.io/en/stable/) for authenticating the user,
    - [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/en/3.0.x/) as our database ORM,
    - [Flask-Migrate](https://flask-migrate.readthedocs.io/en/latest/) for the SQLAlchemy database migrations.
    - [Flask-Socketio](https://flask-socketio.readthedocs.io/en/latest/) for the instant communication with the client.
 - [Sqlite](https://www.sqlite.org/index.html) for our in-memory database.

### Contributing
  - Running the server on localhost:5000 (make sure you are in the server directory).
    - create the virtual environment, activate it, and install the dependencies.
        ``` shell
        python -m venv venv
        venv\Scripts\activate
        pip install -r requirements.txt
        ```
    - add the .env file with the environment variables.
      ``` .env
      DATABASE_URL = "sqlite:///database.db"
      JWT_SECRET_KEY = "your_secret_key"
      DEBUG_MODE = 1
      ```
    - create the database tables from the migrations and run the application.
        ``` shell
        flask db upgrade
        python run.py
        ```
      
  - Running the client on localhost:3000 (make sure you are in the client directory).
    - install the dependencies and run the application.
      ``` shell
      npm install
      npm start
      ```
