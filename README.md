# TaskHub Freelancing Platform

TaskHub is a full-stack freelancing marketplace where clients can post jobs and review bids, while freelancers can browse open work and submit proposals. The project uses a Spring Boot backend, a React frontend, and a local MySQL database.

## What The Project Does

- Supports user registration and login for two roles: client and freelancer.
- Lets clients post jobs, view the jobs they created, and inspect bids for each job.
- Lets freelancers view open jobs and place bids with a proposal message.
- Stores users, jobs, and bids in MySQL.

## Tech Stack

- Backend: Java 17, Spring Boot 3.2, Spring Web, Spring Data JPA, Spring Security
- Database: MySQL
- Frontend: React 19, React Router, Axios, Create React App
- Tooling: Maven, npm

## Key Features

- User registration and login with role-based routing on the frontend.
- BCrypt password hashing on the backend.
- Client dashboard for posting jobs and viewing submitted bids.
- Freelancer dashboard for browsing open jobs and submitting bids.
- REST API for users, jobs, and bids.
- CORS configured for local development between the React app and the backend.

## API Overview

The backend exposes these main endpoints:

- `POST /api/users/register` - register a new user.
- `POST /api/users/login` - authenticate a user.
- `POST /api/jobs/post` - create a new job.
- `GET /api/jobs/open` - list open jobs.
- `GET /api/jobs/client/{clientId}` - list jobs posted by a client.
- `POST /api/jobs/bid` - place a bid on a job.
- `GET /api/jobs/{jobId}/bids` - list bids for a job.

Authentication is currently handled with backend password verification plus frontend `sessionStorage` state. The project does not use JWT or a dedicated session management system.

## Database

The backend is configured to use a local MySQL database named `freelance_platform`.

Default development settings in `freelance-backend/src/main/resources/application.properties`:

- Server port: `8080`
- Database URL: `jdbc:mysql://localhost:3306/freelance_platform`
- Username: `root`
- Password: `root`
- Hibernate schema mode: `update`

Update these values if your local MySQL setup is different.

## Project Structure

```text
.
├── freelance-backend/
│   ├── src/main/java/com/freelanceapp/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── model/
│   │   ├── repository/
│   │   └── service/
│   └── src/main/resources/application.properties
└── freelance-frontend/
	└── src/
		├── components/
		├── App.js
		└── index.js
```

## Prerequisites

- Java 17 or later
- Maven
- Node.js and npm
- MySQL server running locally

## Setup

1. Create the MySQL database if it does not already exist:

```sql
CREATE DATABASE freelance_platform;
```

2. Check the backend database credentials in `freelance-backend/src/main/resources/application.properties` and update them if needed.

3. Install frontend dependencies:

```bash
cd freelance-frontend
npm install
```

4. Build the backend if you want to verify it compiles before running:

```bash
cd freelance-backend
mvn clean install
```

## Run Locally

Open two terminals and start each app separately.

### Backend

```bash
cd freelance-backend
mvn spring-boot:run
```

The API runs at `http://localhost:8080`.

### Frontend

```bash
cd freelance-frontend
npm start
```

The React app runs at `http://localhost:3000`.

## Seed Credentials

On startup, the backend automatically clears the database tables and seeds it with default data. You can log in immediately using the following test accounts:

- **Client Console**: Username `alex_jones` / Password `password`
- **Freelancer Workspace**: Username `elena_rodriguez` / Password `password`

## Redesigned Premium Features

- **Glassmorphism Theme**: Deep-dark backgrounds with frosted-glass containers, neon borders, and glowing action buttons.
- **Visual Statistics Panels**: Real-time stats cards tracking total budgets, active jobs, placed bids, and won projects.
- **Custom Interaction Modals**: No more raw browser alerts or prompts! Placing a proposal or reviewing bids is done via modern React modal sheets.
- **Search & Budget Filters**: Freelancers can easily search jobs by keywords and filter by minimum budget.
- **Bid Acceptance Flow**: Clients can review proposals and click "Accept Bid" to hire a freelancer, which automatically closes the job and rejects other bids.
- **Freelancer Bid Tracker**: Freelancers can track the status (Pending, Accepted, Rejected) of all their bids in real-time.

## Screenshots

- [Login Screen](screenshots/login_screen.png)
- [Register Screen](screenshots/register_screen.png)
- [Client Console & Dashboard](screenshots/client_dashboard.png)
- [Freelancer Workspace & Opportunities](screenshots/freelancer_dashboard.png)

## Contributing

Contributions are welcome. A simple workflow is:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes and verify the app still runs locally.
4. Open a pull request with a clear summary of the change.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Spring Boot
- React
- Axios
- React Router
- Create React App
