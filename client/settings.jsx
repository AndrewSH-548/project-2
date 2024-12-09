const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');

const changePassword = e => {
    e.preventDefault();
    helper.hideError();

    const oldPass = e.target.querySelector('#oldPass').value;
    const newPass = e.target.querySelector('#newPass').value;

    if (!(oldPass && newPass)){
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, {oldPass, newPass}, refreshFields);
    return false;
}   

const refreshFields = e => {
    document.querySelector('#oldPass').value = '';
    document.querySelector('#newPass').value = '';
    helper.handleError(e.message);
}

const PasswordChanger = props => {
    return <form id="passwordForm"
        name='passwordForm'
        onSubmit={changePassword}
        action='/changePassword'
        method='POST'
        className='mainForm'
    >
        <label htmlFor="pass">Old Password: </label>
        <input type="password" id="oldPass" name="oldPass" placeholder="type old password" />
        <label htmlFor="pass2">New Password: </label>
        <input type="password" id="newPass" name="newPass" placeholder="type new password" />
        <input type="submit" className='formSubmit' value="Change Password" />
    </form>
}

const SettingsMenu = () => {
    return <>
        <PasswordChanger />
    </>
}

const init = () => {
    const root = createRoot(document.querySelector("#settings"));
    root.render(<SettingsMenu />);
}

window.onload = init;