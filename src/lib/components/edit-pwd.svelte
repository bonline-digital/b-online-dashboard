<script lang="ts">
    import { passwordnotmatch_toast_store } from "$lib/stores";
    import { Modal } from "bootstrap";
    import { onMount } from "svelte";

    let editing = false;
    let pwd: string;
    let new_pwd: string;
    let new_pwd_conf: string;
    let edit_pwd_modal: Modal;
    let edit_pwd_modal_elem: HTMLDivElement;
    let edit_pwd_form_elem: HTMLFormElement;
    let edit_pwd_pwd_conf_elem: HTMLInputElement;

    function add_user(): void {
        if (new_pwd !== new_pwd_conf) {
            edit_pwd_pwd_conf_elem.setCustomValidity("Password does not match");

            return;
        }

        editing = true;

        fetch("/api/edit-pwd", {
            method: "POST",
            body: JSON.stringify({
                password: pwd,
                new_password: new_pwd,
            }),
        }).then(async (response: Response): Promise<void> => {
            editing = false;

            if (response.status === 200) {
                const response_data = await response.json();
                const status = parseInt(response_data.status);

                if (status === -2) {
                    $passwordnotmatch_toast_store.show();
                }
            } else if (response.status === 403) {
            } else {
            }
        });
    }

    onMount((): void => {
        edit_pwd_modal = new Modal(edit_pwd_modal_elem);
    });
</script>

<div
    bind:this={edit_pwd_modal_elem}
    id="edit-pwd-modal"
    class="modal fade"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
>
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow border-0">
            <div class="modal-body">
                <div class="d-flex justify-content-between align-items-center">
                    <p class="fs-3 m-0">Edit Password</p>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        disabled={editing}
                    ></button>
                </div>
                <form
                    on:submit={add_user}
                    bind:this={edit_pwd_form_elem}
                    action="javascript:"
                >
                    <div class="form-floating mb-2">
                        <input
                            bind:value={pwd}
                            type="password"
                            class="form-control"
                            id="edit-pwd-current"
                            placeholder="Current Password"
                            minlength="8"
                            required
                        />
                        <label for="edit-pwd-current">Current Password</label>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <div class="form-floating me-2">
                            <input
                                bind:value={new_pwd}
                                type="password"
                                class="form-control"
                                id="edit-pwd-new"
                                placeholder="New Password"
                                minlength="8"
                                required
                            />
                            <label for="edit-pwd-new">New Password</label>
                        </div>
                        <div class="form-floating">
                            <input
                                bind:this={edit_pwd_pwd_conf_elem}
                                bind:value={new_pwd_conf}
                                type="password"
                                class="form-control"
                                id="edit-pwd-confirm"
                                placeholder="Confirm Password"
                                minlength="8"
                                required
                            />
                            <label for="edit-pwd-confirm"
                                >Confirm Password</label
                            >
                        </div>
                    </div>
                    <div class="d-flex justify-content-end mt-2">
                        <button
                            type="submit"
                            class="btn btn-primary"
                            disabled={editing}>Confirm</button
                        >
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
