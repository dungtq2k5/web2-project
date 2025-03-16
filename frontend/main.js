import { setAuth } from "./controllers/users.js";
import renderUsersManagePage from "./views/users-management.js";

setAuth({
  email: "dungtranquang2005@gmail.com",
  password: "password123456789"
});

renderUsersManagePage();