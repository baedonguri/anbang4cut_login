import React from 'react'
import axios from 'axios';
import { withRouter } from 'react-router-dom'

function LobbyPage(props) {

    const onClickHandler = () => {
        axios.get(`/api/user/logout`)
        .then(response => {
            if(response.data.success) {
                alert('로그아웃 되었습니다.');
                props.history.push('/');
            } else {
                alert("로그아웃 실패")
            }
        })
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh'
        }}>
            <h2>로비입니다.</h2>       
            <button onClick={onClickHandler}>로그아웃</button>
            
        </div>
    )
}
export default withRouter(LobbyPage)