const Notification = ({ message }) => {
    if (message == null) {
        return null
    }

    return (
        <div className='p-4 mb-4 text-green-800 bg-green-100 border border-green-400 rounded-lg'>
            {message}
        </div>
    )
}

export default Notification