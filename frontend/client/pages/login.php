<div class="d-flex justify-content-center align-items-center" 
    style="height: 100vh;
    background-image: url('');
    background-size: contain;
    object-fit: cover">
    <div class="card p-4" style="width: 400px;">
        <a href="#" class="text-decoration-none text-dark"><h2 class="text-center mb-4">GARMIN</h2></a>
        <h4 class="text-center mb-4">SIGN IN</h4>
        <form id="login-form">
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" placeholder="Enter your email" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <div class="input-group">
                    <input type="password" class="form-control" id="password" placeholder="Enter your password" required>
                    <button type="button" class="btn btn-outline-secondary" onclick="togglePassword()">Show</button>
                </div>
            </div>
            <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="remember">
                <label class="form-check-label" for="remember">Remember me</label>
            </div>
            <div class="d-flex justify-content-between mb-3">
                <a href="#" class="text-dark">Forgot password?</a>
            </div>
            <button type="submit" class="btn btn-dark w-100">LOGIN</button>
            <div class="text-center mt-3">
                Don't have an account yet? <a href="#" class="text-dark">Lets make one!</a>
            </div>
        </form>
    </div>
</div>

<script>
    function togglePassword() {
        const password = document.getElementById("password");
        if (password.type === "password") {
            password.type = "text";
        } else {
            password.type = "password";
        }
    }
</script>
