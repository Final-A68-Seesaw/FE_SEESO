import React from 'react'

import { history } from '../redux/configStore'

const Detail = () => {
    return (
        <div>
            <p>Signup</p>
            
            <button onClick={() => history.push('/main')}>몰라</button>
        </div>
    )
}

export default Detail