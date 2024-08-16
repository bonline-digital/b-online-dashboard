<form action="javascript:">
    <div class="form-floating mb-2">
        <input
            type="text"
            class="form-control"
            id="add-user-name"
            placeholder="Username"
        />
        <label for="add-user-name">Username</label>
    </div>
    <div class="d-flex justify-content-between mb-2">
        <div class="form-floating me-2">
            <input
                type="password"
                class="form-control"
                id="add-user-password"
                placeholder="Password"
            />
            <label for="add-user-password">Password</label>
        </div>
        <div class="form-floating">
            <input
                type="password"
                class="form-control"
                id="add-user-confirm-password"
                placeholder="Confirm Password"
            />
            <label for="add-user-confirm-password">Confirm Password</label>
        </div>
    </div>
    <div class="form-check">
        <input
            class="form-check-input"
            type="checkbox"
            value=""
            id="add-user-admin"
        />
        <label class="form-check-label" for="add-user-admin">Is admin</label>
    </div>
    <div class="d-flex justify-content-end mt-2">
        <button type="submit" class="btn btn-primary">Confirm</button>
    </div>
</form>
