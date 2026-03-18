import React from 'react'
import './account.css'
import * as Icon from '../../icons'

function Account() {
    // all functions like useState/useEffect are written here, before the return
    // commends in this sections are with // like in JS, as this is the script zone of the doc

  return (
    <div className="inspiration-content">
        {/*render zone, comments must be used like this here*/}
        {/*i have copied a part from the inspiration page to give some example*/}
        {/*you can delete all these divs here and start the work for about/account, the page is already routed to all the other ones from the Router on App.jsx*/}
        {/*Use the .css files of the same name in their folders for the specific pages, the accounts one uses account.css*/}

        {/*
                -'-'-'-'-'-'-'-'- INFO -'-'-'-'-'-'-'-'-
                You access this page by clicking on the user icon on the top right
                This is going to be the account page, i have not managed this on the backend yet
                But i would want a mock model for it for when i will work on it later
                I basically want some nice design containers and structure for the account elements
                It will have a space for the user details, like their personal data
                + a lower section after that where the ticket history will be
                Do not fill these information, i just want a clean space for them
                They will be filled individually depending on what account is logged in on the page
        */}

        <div className="glass-card">
            <h2 className="section-heading">About Page</h2>

        </div>

    </div>
  )
}

export default Account