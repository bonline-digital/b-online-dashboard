<script lang="ts">
    import { Modal } from "bootstrap";
    import { onMount } from "svelte";

    let adding = false;
    let add_user_name: string;
    let add_user_pwd: string;
    let add_user_pwd_conf: string;
    let add_user_admin: boolean;
    let add_user_modal: Modal;
    let add_user_form_elem: HTMLFormElement;
    let add_user_pwd_conf_elem: HTMLInputElement;

    function add_user(): void {
        if (add_user_pwd !== add_user_pwd_conf) {
            add_user_pwd_conf_elem.setCustomValidity("Password does not match");

            return;
        }

        adding = true;

        fetch("/api/add-user", {
            method: "POST",
            body: JSON.stringify({
                username: add_user_name.toString(),
                password: add_user_pwd,
                admin: add_user_admin === true,
            }),
        }).then((response: Response) => {
            adding = false;

            if (response.status !== 200) {
            }
        });
    }

    onMount((): void => {
        add_user_modal = new Modal("add-user-modal");
    });
</script>

<div
    id="add-user-modal"
    class="modal fade"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
>
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0">
            <div class="modal-body">
                <div class="d-flex justify-content-between align-items-center">
                    <p class="fs-3 m-0">Add User</p>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        disabled={adding}
                    ></button>
                </div>
                <form
                    on:submit={add_user}
                    bind:this={add_user_form_elem}
                    action="javascript:"
                >
                    <div class="form-floating mb-2">
                        <input
                            bind:value={add_user_name}
                            type="text"
                            class="form-control"
                            id="add-user-name"
                            placeholder="Username"
                            required
                        />
                        <label for="add-user-name">Username</label>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <div class="form-floating me-2">
                            <input
                                bind:value={add_user_pwd}
                                type="password"
                                class="form-control"
                                id="add-user-password"
                                placeholder="Password"
                                minlength="8"
                                required
                            />
                            <label for="add-user-password">Password</label>
                        </div>
                        <div class="form-floating">
                            <input
                                bind:this={add_user_pwd_conf_elem}
                                bind:value={add_user_pwd_conf}
                                type="password"
                                class="form-control"
                                id="add-user-confirm-password"
                                placeholder="Confirm Password"
                                minlength="8"
                                required
                            />
                            <label for="add-user-confirm-password"
                                >Confirm Password</label
                            >
                        </div>
                    </div>
                    <div class="form-check">
                        <input
                            bind:checked={add_user_admin}
                            class="form-check-input"
                            type="checkbox"
                            id="add-user-admin"
                        />
                        <label class="form-check-label" for="add-user-admin"
                            >Is admin</label
                        >
                    </div>
                    <div class="d-flex justify-content-end mt-2">
                        <button
                            type="submit"
                            class="btn btn-primary"
                            disabled={adding}>Confirm</button
                        >
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
