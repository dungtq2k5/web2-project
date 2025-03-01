<div class="d-flex justify-content-center align-items-center" 
    style="height: 100vh;
    background-image: url('');
    background-size: contain;
    object-fit: cover">
    <div class="card p-4" style="width: 400px;">
        <a href="#" class="text-decoration-none text-dark"><h2 class="text-center mb-4">GARMIN</h2></a>
        <h4 class="text-center mb-4">SIGN UP</h4>
        <form id="register-form">
            <div class="mb-3">
                <label for="fullname" class="form-label">Fullname</label>
                <input type="texttext" class="form-control" id="fullname" placeholder="Enter your fullname" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" placeholder="Enter your email" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <div class="input-group">
                    <input type="password" class="form-control password-field" id="password" placeholder="Enter your password" required>
                    <button type="button" class="btn btn-outline-secondary" onclick="togglePassword()">Show</button>
                </div>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Repeat password</label>
                <div class="input-group">
                    <input type="password" class="form-control password-field" id="repeat-password" placeholder="Enter your password" required>
                    <button type="button" class="btn btn-outline-secondary" onclick="togglePassword()">Show</button>
                </div>
            </div>
            <button type="submit" class="btn btn-dark w-100">REGISTER</button>
            <div class="text-center mt-3">
                Already have an account? <a href="#" class="text-dark">Lets login!</a>
            </div>
        </form>
    </div>
</div>

<script>
    function togglePassword() {
        const passwords = document.querySelectorAll(".password-field");

        passwords.forEach((password) => {
            if (password.type === "password") {
                password.type = "text";
            } else {
                password.type = "password";
            }
        });
    }
</script>
