import React from "react";
import "../../style/profile.scss";
import Header from "../Header";
import Button from "../Button";
import useProfile from "../../hooks/useProfile";
import Loader from "../Loader";
import Warning from "../Warning";
import PopUp from "../PopUp"
import NotFound from "../NotFound"

function Profile() {
  let {
    user,
    edit,
    save,
    warn,
    editProfile,
    logoutAll,
    popup,
    deleteAccount,
    fetchStatus,
    handelChange,
    handelEdit,
    handelLogoutAll,
    handelSave,
    handelDeleteAccount,
  } = useProfile();
  return (
    <div className="page profile-page">
      <Header />
      {!user ? (
        <Loader height={70} width={6} margin={4} />
      ) : 
       fetchStatus.error === "ServerError" ? 
         <NotFound 
         code="5xx"
         message="Somethings goes wrong try after sometime"
         redirectLinkName="Home"
         redirectLink="/"
         />
       :
      (
        <main style={{pointerEvents: popup ? "none" : "auto"}}>
            <form id="editProfileForm" onSubmit={handelSave}>
            <div className="profile">
              <Warning warn={warn.status}>{warn.message}</Warning>
              
              <div className="row row1">
                <p className="field">Name:</p>
                {!edit ? (
                  <div className="value">{user.name} </div>
                ) : (
                  <input
                    type="text"
                    name="name"
                    className="value"
                    value={editProfile.name}
                    onChange={handelChange}
                    disabled={save}
                    required={true}
                  />
                )}
              </div>
              <div className="row row2">
                <p className="field">Email:</p>
                {!edit ? (
                  <div className="value">{user.email} </div>
                ) : (
                  <input
                    type="email"
                    name="email"
                    className="value"
                    value={editProfile.email}
                    onChange={handelChange}
                    disabled={save}
                    required={true}
                  />
                )}
              </div>
              <div className="row row3">
                <p className="field">Username:</p>
                {!edit ? (
                  <div className="value">{user.username} </div>
                ) : (
                  <input
                    type="text"
                    name="username"
                    className="value"
                    value={editProfile.username}
                    onChange={handelChange}
                    disabled={save}
                    required={true}
                  />
                )}
              </div>
            </div>
            </form>
            <div className="btn-group">
              <div>
                {!save && (
                  <Button className="secondary-btn" onClick={handelEdit}>
                    {edit ? "Cancel" : "Edit"}
                  </Button>
                )}
                {edit && (
                  <Button
                    type= "submit"
                    form="editProfileForm"
                    className="secondary-btn"
                    loader={save}
                    disabled={save}
                  >
                    Save
                  </Button>
                )}
              </div>
              <div>
            <Button 
            className="secondary-btn" 
            onClick={handelLogoutAll}
            loader={logoutAll}
            disabled={logoutAll}
            >
              Logout From All Device
            </Button>
            <Button
               className="secondary-btn" 
               onClick={handelDeleteAccount}
               disabled={popup}
               name="deleteAccount"
            >
               Delete Account
            </Button>
          </div>
            </div>
          
        </main>
      )}

      <PopUp show={popup}>
          <p>Do you want to delete your account?</p>
          <div>
          <Button 
             className="secondary-btn safe-btn"
             style={{
               display: deleteAccount ? "none" : "inline-block"
              }}
              name= "cancel"
              onClick={handelDeleteAccount}
             >
            Cancel
           </Button>
          <Button 
           className="secondary-btn danger-btn"
           disabled={deleteAccount}
           name="delete"
           onClick={handelDeleteAccount}
           loader={deleteAccount}
          >
            Delete
           </Button>
          </div>
      </PopUp>
    </div>
  );
}

export default Profile;
