import React from 'react'
import useResetPassword from '../../hooks/useResetPassword'
import Form, {FormInput} from '../Form'
import Button from '../Button'
import Warning from '../Warning'
import Loader from '../Loader'
import NotFound from '../NotFound'
import {Link} from 'react-router-dom'

function ResetPassword() {
    
    let {
        loader,
        fetchStatus,
        warn,
        newPassword,
        formSubmit,
        handelChange,
        handelSubmit
    }  = useResetPassword()



    return (
        <div className="reset-home">
            {
                 loader ? <Loader height={70} width={6} margin={4}/> :
                (fetchStatus.error && <Status {...{fetchStatus}} />)
                  ||
                (fetchStatus.success && <Status {...{fetchStatus}} />)
                  ||
                <div className="authe-form">
                    <Warning  {...{warn}}>
                       Password must be min 8 characters long
                    </Warning>
                    <Form onSubmit={handelSubmit}>
                        <FormInput 
                            type="password"
                            name="newPassword"
                            placeholder="Enter new password"
                            required={true}
                            onChange={handelChange}
                            value={newPassword}
                            disabled={formSubmit}
                        />
                        <Button
                          type="submit"
                          className="secondary-btn submit-btn"
                          disabled={formSubmit}
                          loader={formSubmit}
                        >
                            Reset Password
                        </Button>
                    </Form>
                </div>
            }
        </div>
    )
}

function Status({fetchStatus}){
   
     return(
         <>
            {
                (fetchStatus.error === "LinkNotFoundError" 
                &&  <NotFound />) 
                ||
                (fetchStatus.error === "LinkExpireError"
                && 
                <div className="reset-status">
                  <h2>Link is expire</h2>
                  <p>For reset password go to <Link to="/forgot">forgot page</Link></p>
                </div>)
                ||
                (fetchStatus.success === "ResetDone"
                 &&  
                 <div className="reset-status">
                   <h2>Password reset successfully</h2>
                   <p>Go to <Link to="/login">login page</Link></p>
                 </div>)
            }
         </>
     )
}

export default ResetPassword