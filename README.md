# Project Overview: Smartwatch Selling Website

This project is a website dedicated to selling smartwatches, developed as a requirement for the Web2 subject at school. It features separate interfaces for buyers and administrators.

## Technologies Used

- **Backend API:** PHP, utilizing Composer for package management.
- **Frontend:** HTML, CSS, JavaScript, with jQuery and Bootstrap for enhanced UI/UX.
- **Database Design:** The Entity Relationship Diagram (ERD) is available in the `erd.drawio` file.
- **Program Architecture:** Follow MVC model.

## Important Notes

- Styling for the website was assisted by GitHub Copilot.
- Due to time constraints, GitHub Copilot was utilized for significant portions of the frontend logic, particularly within the `frontend/buyer` directory. While functional, this AI-generated code may not have undergone exhaustive manual review.

## Project Setup

To run this project locally, please follow these steps:

1. Ensure XAMPP (or a similar AMP stack) and Composer are installed and configured on your system.
2. Clone this repository into a new folder within your XAMPP `htdocs` directory (e.g., `xampp/htdocs/web2-project`).
3. Navigate to the `api` directory in your terminal (`cd api`) and run `composer install` to install backend dependencies.
4. In the `api` directory, create a `.env` file by copying the contents of `.env.example` and update it with your local database credentials and other environment-specific settings if needed.
5. Open the XAMPP Control Panel and start the Apache and MySQL services.
6. Import the database schema and mock data by executing the `init_db.sql` & `mock_data.sql` file in your MySQL administration tool (e.g., phpMyAdmin).
7. Access the buyer interface by navigating to `index.php` in the `buyer` folder (e.g., `http://localhost/frontend/buyer/index.php`).
8. Access the admin interface by navigating to `index.php` in the `admin` folder (e.g., `http://localhost/frontend/admin/index.php`).
9. The default admin account credentials are:
    - **Email:** `admin@gmail.com`
    - **Password:** `password123456789`
    (These credentials can also be found in the `mock_data.sql` file).
10. Explore the project!

## API Documentation

The API functionality and endpoints can be explored via the following Postman collection:
[Postman API Collection](https://martian-sunset-879935.postman.co/workspace/New-Team-Workspace~c32f74a3-9dc2-415b-99d7-88e6b7edf9af/collection/32178309-b1c3dabc-49d7-439f-a418-b85cfc7f1825?action=share&creator=32178309)

## Contributing

Contributions to this project are welcome! If you have suggestions for improvements or encounter any issues, please feel free to submit a pull request or open an issue on the repository. More detailed contribution guidelines may be added as the project evolves.

## License

This project is currently unlicensed. Consider adding an open-source license like the MIT License if you wish to share it more broadly.
