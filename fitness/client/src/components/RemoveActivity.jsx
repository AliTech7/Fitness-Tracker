import React from "react";
import axios from "axios";


function RemoveActivity(props) {
    const {activityId, cd} = props
    const token = localStorage.getItem("authToken")

    function deleteActivity() {

        axios
        .delete(`http://localhost8000/activity/${activityId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })

            .then(res => {
                console.log(res)
                cd()
            })

            .catch(err => console.log(err))
    }

    return (
        <>
        <button className="btn btn-danger" onClick={deleteActivity}>
            Delete
        </button>
        </>
    )
}

export default RemoveActivity
