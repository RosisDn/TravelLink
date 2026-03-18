import React from 'react'
import './about.css'
import * as Icon from '../../icons'

function About() {
    // all functions like useState/useEffect are written here, before the return
    // commends in this sections are with // like in JS, as this is the script zone of the doc

  return (
    <div className="inspiration-content">
        {/*render zone, comments must be used like this here*/}
        {/*i have copied a part from the inspiration page to give some example*/}
        {/*you can delete all these divs here and start the work for about, the page is already routed to all the other ones from the Router on App.jsx*/}
        {/*Use the .css files of the same name in their folders for the specific pages, this page uses about.css, the accounts one uses account.css*/}

        <div className="glass-card">
            <h2 className="section-heading">About Page</h2>

        </div>

    </div>
  )
}

export default About